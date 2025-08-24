const Event = require("../Model/eventModel");

exports.createEvents = async (req, res) => {
  try {
    const { title, description, date, time, venue } = req.body;
    if (!title || !description || !date || !time || !venue) {
      return res.status(400).json({
        error: "Missing required fields: title, description, date, time, venue",
      });
    }

    const event = new Event(req.body);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(400).json({ error: err.message });
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
