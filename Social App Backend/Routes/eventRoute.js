const express = require("express");
const {
  createEvents,
  getEvents,
  deleteEvent,
} = require("../controllers/eventController");
const multer = require("multer");
const path = require("path");
// Configure multer for event image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/events");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const eventRoute = express.Router();

eventRoute.post("/", upload.single("image"), createEvents);
eventRoute.get("/", getEvents);
eventRoute.delete("/:id", deleteEvent);

module.exports = eventRoute;
