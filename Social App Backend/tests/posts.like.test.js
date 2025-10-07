const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
let app;
let server;

const User = require("../Model/userModel");
const Post = require("../Model/postModel");

describe("POST /posts/:id/like and DELETE /posts/:id/like", () => {
  let mongod;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri, { autoIndex: true });

    // require app after mongoose is connected to avoid race in App.js
    app = require("../App");
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    // clear db
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  test("user can like a post once and like count is updated", async () => {
    const user = await User.create({ username: "tester", password: "pw" });
    const post = await Post.create({
      title: "t",
      body: "b",
      tags: [],
      reactions: 0,
    });

    // mock session by creating an agent and setting session cookie via login route or direct session manipulation
    const agent = request.agent(app);

    // create a fake login by setting session user via test-only endpoint if exists; otherwise simulate by setting cookie
    // As a fallback, we directly set req.session in a simple test helper route. Create the helper route on the fly.
    app.post("/__test__/login-as", (req, res) => {
      req.session.user = { id: String(user._id) };
      res.json({ ok: true });
    });

    await agent.post("/__test__/login-as").send();

    // First like
    const r1 = await agent.post(`/api/posts/${post._id}/like`).send();
    expect(r1.status).toBe(200);
    expect(r1.body.reactions).toBe(1);
    expect(r1.body.hasLiked).toBe(true);

    // Second like should be idempotent and not increase count
    const r2 = await agent.post(`/api/posts/${post._id}/like`).send();
    expect(r2.status).toBe(200);
    expect(r2.body.message).toMatch(/Already liked|Post liked/);

    const refreshed = await Post.findById(post._id);
    expect(refreshed.reactions).toBe(1);
    expect(refreshed.likedBy.length).toBe(1);
  });

  test("concurrent likes only count once", async () => {
    const user = await User.create({ username: "concurrent", password: "pw" });
    const post = await Post.create({
      title: "t",
      body: "b",
      tags: [],
      reactions: 0,
    });

    const agent = request.agent(app);
    app.post("/__test__/login-as", (req, res) => {
      req.session.user = { id: String(user._id) };
      res.json({ ok: true });
    });

    await agent.post("/__test__/login-as").send();

    // Fire several like requests in parallel
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(agent.post(`/api/posts/${post._id}/like`).send());
    }

    const results = await Promise.all(promises);
    // All should return 200
    results.forEach((r) => expect(r.status).toBe(200));

    const refreshed = await Post.findById(post._id);
    expect(refreshed.reactions).toBe(1);
    expect(refreshed.likedBy.length).toBe(1);
  });

  test("user can unlike a post", async () => {
    const user = await User.create({ username: "unliker", password: "pw" });
    const post = await Post.create({
      title: "t",
      body: "b",
      tags: [],
      reactions: 0,
    });

    const agent = request.agent(app);
    app.post("/__test__/login-as", (req, res) => {
      req.session.user = { id: String(user._id) };
      res.json({ ok: true });
    });

    await agent.post("/__test__/login-as").send();

    await agent.post(`/api/posts/${post._id}/like`).send();
    const afterLike = await Post.findById(post._id);
    expect(afterLike.reactions).toBe(1);

    const r = await agent.delete(`/api/posts/${post._id}/like`).send();
    expect(r.status).toBe(200);
    expect(r.body.reactions).toBe(0);
    expect(r.body.hasLiked).toBe(false);

    const refreshed = await Post.findById(post._id);
    expect(refreshed.reactions).toBe(0);
    expect(refreshed.likedBy.length).toBe(0);
  });
});
