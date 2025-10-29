import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { io as ioClient } from "socket.io-client";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function generateGangId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "GNG-";
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export default function CommunityPage({ currentUser }) {
  const [view, setView] = useState("landing"); // landing | dashboard
  const [modal, setModal] = useState(null); // 'create' | 'join' | null
  const [gangId, setGangId] = useState("");
  const [gangName, setGangName] = useState("");
  const [description, setDescription] = useState("");
  const [gang, setGang] = useState(null);
  const [tab, setTab] = useState("posts");

  // posts
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");

  // chat
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const [toast, setToast] = useState({
    message: "",
    type: "info",
    open: false,
  });

  function showToast(message, type = "info", timeout = 3500) {
    setToast({ message, type, open: true });
    if (timeout > 0)
      setTimeout(() => setToast((t) => ({ ...t, open: false })), timeout);
  }

  function getUserId() {
    // prefer prop, then sessionStorage fallback
    if (currentUser)
      return currentUser._id || currentUser.id || currentUser.userId || null;
    try {
      const s = sessionStorage.getItem("user");
      if (!s) return null;
      const parsed = JSON.parse(s);
      return parsed._id || parsed.id || parsed.userId || null;
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    // cleanup socket on unmount
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (gang) {
      // fetch posts and messages
      fetchPosts(gang.gangId);
      fetchMessages(gang.gangId);

      // setup socket
      socketRef.current = ioClient(API, { transports: ["websocket"] });
      socketRef.current.emit("joinGang", gang.gangId);

      socketRef.current.on("message", (msg) => {
        if (msg.gangId === gang.gangId) setMessages((s) => [...s, msg]);
      });
      socketRef.current.on("post", (post) => {
        if (post.gangId === gang.gangId) setPosts((s) => [post, ...s]);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.emit("leaveGang", gang.gangId);
          socketRef.current.disconnect();
        }
      };
    }
  }, [gang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function createGang() {
    // frontend validation
    const userId = getUserId();
    if (!gangName || !gangName.trim()) {
      showToast("Gang name is required", "error");
      return;
    }
    if (!userId) {
      showToast("You must be logged in to create a gang", "error");
      return;
    }

    const id = gangId || generateGangId();
    try {
      const payload = {
        gangId: id,
        gangName: gangName.trim(),
        description,
        userId,
      };
      const res = await axios.post(`${API}/api/gangs/create`, payload, {
        withCredentials: true,
      });
      setGang(res.data.gang);
      setView("dashboard");
      setModal(null);
      showToast("Gang created", "success");
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.error || "Failed to create gang", "error");
    }
  }

  async function joinGangById() {
    // basic validation
    const userId = getUserId();
    if (!gangId || !gangId.trim()) {
      showToast("Please enter a Gang ID to join", "error");
      return;
    }
    if (!userId) {
      showToast("You must be logged in to join a gang", "error");
      return;
    }

    try {
      const res = await axios.get(`${API}/api/gangs/${gangId}`, {
        withCredentials: true,
      });
      // call join endpoint
      await axios.post(
        `${API}/api/gangs/join`,
        { gangId, userId },
        { withCredentials: true }
      );
      setGang(res.data.gang);
      setView("dashboard");
      setModal(null);
      showToast("Joined gang", "success");
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.error || "Failed to join gang", "error");
    }
  }

  async function fetchPosts(gid) {
    try {
      const res = await axios.get(`${API}/api/posts/${gid}`);
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchMessages(gid) {
    try {
      const res = await axios.get(`${API}/api/messages/${gid}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function submitPost(e) {
    e.preventDefault();
    try {
      const payload = {
        gangId: gang.gangId,
        userId: currentUser._id,
        text: postText,
      };
      const res = await axios.post(`${API}/api/posts`, payload);
      setPosts((p) => [res.data.post, ...p]);
      // emit via socket
      socketRef.current?.emit("newPost", res.data.post);
      setPostText("");
    } catch (err) {
      console.error(err);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!messageText.trim()) return;
    try {
      const payload = {
        gangId: gang.gangId,
        userId: currentUser._id,
        message: messageText,
      };
      const res = await axios.post(`${API}/api/messages`, payload);
      setMessages((m) => [...m, res.data.message]);
      socketRef.current?.emit("newMessage", res.data.message);
      setMessageText("");
    } catch (err) {
      console.error(err);
    }
  }

  if (view === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 p-6 flex items-start justify-center">
        <div className="w-full max-w-3xl glass p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🔥</div>
              <h1 className="text-2xl font-semibold">Add Gang</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setModal("create");
                  setGangId(generateGangId());
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md shadow"
              >
                Create Gang
              </button>
              <button
                onClick={() => setModal("join")}
                className="px-4 py-2 bg-white/30 border border-white/40 rounded-md"
              >
                Join Gang
              </button>
            </div>
          </div>

          <AnimatePresence>
            {modal === "create" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-white/30 rounded-lg"
              >
                <div className="mb-2 text-sm text-gray-700">
                  Gang ID: <strong>{gangId}</strong>
                </div>
                <input
                  className="w-full p-2 mb-2 rounded"
                  placeholder="Gang Name"
                  value={gangName}
                  onChange={(e) => setGangName(e.target.value)}
                />
                <textarea
                  className="w-full p-2 mb-2 rounded"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={createGang}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setModal(null)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {modal === "join" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-4 bg-white/30 rounded-lg"
              >
                <input
                  className="w-full p-2 mb-2 rounded"
                  placeholder="Enter Gang ID (e.g. GNG-A123BC)"
                  value={gangId}
                  onChange={(e) => setGangId(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={joinGangById}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded"
                  >
                    Join
                  </button>
                  <button
                    onClick={() => setModal(null)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Toast */}
        {toast.open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg text-sm ${
              toast.type === "error"
                ? "bg-red-600 text-white"
                : toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-white"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto glass p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{gang.gangName}</h2>
            <div className="text-sm text-gray-500">{gang.gangId}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTab("posts")}
              className={`px-4 py-2 rounded ${
                tab === "posts"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                  : ""
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setTab("chat")}
              className={`px-4 py-2 rounded ${
                tab === "chat"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                  : ""
              }`}
            >
              Chat
            </button>
          </div>
        </div>

        {tab === "posts" && (
          <div>
            <form onSubmit={submitPost} className="mb-4">
              <textarea
                className="w-full p-3 rounded mb-2"
                placeholder="What's happening in the Gang?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              />
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded">
                  Post
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {posts.map((p) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white/60 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-white">
                      {p.userId?.username?.[0] || "U"}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {p.userId?.username || "Unknown"}
                      </div>
                      <div className="text-sm text-gray-700">{p.text}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(p.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "chat" && (
          <div className="flex flex-col h-[60vh]">
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m, idx) => {
                const mine =
                  m.userId?._id === currentUser._id ||
                  m.userId === currentUser._id;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`max-w-[80%] ${
                      mine ? "ml-auto bg-green-100 text-right" : "bg-white/60"
                    } p-3 rounded-xl`}
                  >
                    <div className="text-sm">
                      {m.userId?.username || "User"}
                    </div>
                    <div className="mt-1">{m.message}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </div>
                  </motion.div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={sendMessage} className="mt-2 flex gap-2">
              <input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 p-2 rounded"
                placeholder="Write a message"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
      {/* Toast */}
      {toast.open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg text-sm ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-white"
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  );
}
