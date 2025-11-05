import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventsPost from "./EventsPost";
import {
  getEventsFromServer,
  deleteEventFromServer,
} from "../services/eventService";

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

  // Handle delete for a specific event
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEventFromServer(eventId);
        setEvents((prev) =>
          prev.filter((e) => e._id !== eventId && e.id !== eventId)
        );
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      // ✅ Use smaller padding on mobile, larger on desktop
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      // ✅ Use smaller padding on mobile, larger on desktop
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        {/* ✅ Stack header on mobile, row on desktop */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sm:gap-0">
          {/* ✅ Smaller text on mobile, larger on desktop */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Events
          </h1>
          <button
            onClick={() => navigate("/create-event")}
            // ✅ Full-width on mobile, auto-width on desktop
            className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
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
    // ✅ Use smaller padding on mobile, larger on desktop
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Header */}
      {/* ✅ Stack header on mobile (gap-4), row on desktop (gap-0) */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4 sm:gap-0">
        <div>
          {/* ✅ Smaller text on mobile, larger on desktop */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Events
          </h1>
          <h6 className="text-gray-600">
            College or Club Events will appear here - Stay tuned!
          </h6>
        </div>
        <button
          onClick={() => {
            const token = localStorage.getItem("eventToken");
            if (token) {
              navigate("/create-event");
            } else {
              navigate("/event-login");
            }
          }}
          // ✅ Full-width on mobile, auto-width on desktop
          className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create Event
        </button>
      </div>

      {/* Events Grid */}
      {Array.isArray(events) && events.length > 0 ? (
        // ✅ Your grid was already responsive!
        // ✅ Default is 1 col (mobile). `md:` is tablet. `lg:` is desktop.
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events
            .slice()
            .reverse()
            .map((event) => (
              <EventsPost
                key={event._id || event.id}
                event={event}
                onDelete={handleDeleteEvent} // ✅ delete handled only here
              />
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3>No Events Yet</h3>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
