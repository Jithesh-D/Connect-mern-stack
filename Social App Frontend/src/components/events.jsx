// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import EventsPost from "./eventsPost.jsx";

// const Events = () => {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     // Load events from localStorage (or from API later if needed)
//     const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
//     setEvents(storedEvents);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Events</h1>
//           <Link
//             to="/create-event"
//             className="inline-flex items-center px-4 py-2 border border-transparent
//                        rounded-md shadow-sm text-sm font-medium text-white
//                        bg-indigo-600 hover:bg-indigo-700 focus:outline-none
//                        focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Create Event
//           </Link>
//         </div>

//         {/* Events List */}
//         <div className="space-y-6">
//           {events.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-gray-500">No events found. Create one!</p>
//             </div>
//           ) : (
//             events.map((event) => <EventsPost key={event.id} event={event} />)
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Events;
