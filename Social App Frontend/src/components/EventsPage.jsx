import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventsPost from "./EventsPost";
import { getEventsFromServer } from "../services/eventService";

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from the server
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getEventsFromServer();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message || "Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle image upload for a specific event
  const handleImageUpload = async (file, eventId) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      // Upload to backend API
      const res = await fetch(
        `http://localhost:5000/api/events/${eventId}/upload-image`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to upload image");

      // Refresh events after successful upload
      fetchEvents();
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <button
            onClick={() => navigate("/create-event")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Create Event
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            <strong>Error:</strong> {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        <button
          onClick={() => navigate("/create-event")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create Event
        </button>
      </div>

      {/* Events Grid */}
      {Array.isArray(events) && events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events
            .slice()
            .reverse()
            .map((event) => (
              <EventsPost
                key={event._id || event.id}
                event={event}
                onImageUpload={(file) => handleImageUpload(file, event._id)}
                onEventUpdate={fetchEvents}
              />
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-xl mb-4">No events yet</div>
          <p className="text-gray-400 mb-6">Be the first to create an event!</p>
          <button
            onClick={() => navigate("/create-event")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
          >
            Create Your First Event
          </button>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
