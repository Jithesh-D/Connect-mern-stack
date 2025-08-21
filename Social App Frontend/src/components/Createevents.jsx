import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    subtitle: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    registrationLink: "",
    whatsappLink: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Load existing events
    const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");

    // Add new event with unique id
    const newEvent = { ...eventData, id: Date.now() };
    const updatedEvents = [...storedEvents, newEvent];

    // Save to localStorage
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    // Redirect to /events
    navigate("/events");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Create New Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            placeholder="Event Title"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="text"
            name="subtitle"
            value={eventData.subtitle}
            onChange={handleChange}
            placeholder="Event Subtitle"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
          />

          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            placeholder="Event Description"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
              required
            />

            <input
              type="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <input
            type="text"
            name="venue"
            value={eventData.venue}
            onChange={handleChange}
            placeholder="Venue"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="url"
            name="registrationLink"
            value={eventData.registrationLink}
            onChange={handleChange}
            placeholder="Registration Link"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="url"
            name="whatsappLink"
            value={eventData.whatsappLink}
            onChange={handleChange}
            placeholder="WhatsApp Group Link"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
          >
            Post Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
