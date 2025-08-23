const express = require("express");

const { createEvents, getEvents } = require("../controllers/eventController");

const eventRoute = express.Router();

eventRoute.post("/events", createEvents);
eventRoute.get("/events", getEvents);

module.exports = eventRoute;
