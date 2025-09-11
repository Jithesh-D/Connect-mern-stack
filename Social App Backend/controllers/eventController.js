const Event = require("../Model/eventModel");

exports.createEvents = async (req, res) => {
  try {
    console.log("Received event creation request:", {
      body: req.body,
      file: req.file,
    });

    const { title, description, date, time, venue } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");
    if (!date) missingFields.push("date");
    if (!time) missingFields.push("time");
    if (!venue) missingFields.push("venue");

    if (missingFields.length > 0) {
      console.log("Missing required fields:", missingFields);
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    let image = null;
    if (req.file) {
      console.log("Image file received:", req.file);
      image = `/uploads/events/${req.file.filename}`;
    }

    const eventData = {
      ...req.body,
      image,
    };

    console.log("Creating event with data:", eventData);

    const event = new Event(eventData);
    const savedEvent = await event.save();

    console.log("Event created successfully:", savedEvent);
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(400).json({
      error: err.message,
      details: "An error occurred while creating the event",
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("Error retrieving events:", err);
    res.status(500).json({ error: err.message });
  }
};
