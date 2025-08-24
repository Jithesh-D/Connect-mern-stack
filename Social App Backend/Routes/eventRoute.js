const express = require("express");
const { createEvents, getEvents } = require("../controllers/eventController");

const eventRoute = express.Router();

eventRoute.post("/", createEvents);
eventRoute.get("/", getEvents);

module.exports = eventRoute;
