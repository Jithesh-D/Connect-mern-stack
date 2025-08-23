import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventsPost from "./EventsPost";

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
    setEvents(storedEvents);
  }, []);

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

      {events.length === 0 ? (
        <p className="text-gray-600">No events yet. Create one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events
            .slice()
            .reverse()
            .map((event) => (
              <EventsPost key={event.id} event={event} />
            ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
