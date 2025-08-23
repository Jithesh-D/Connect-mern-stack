const EventsPost = ({ event }) => {
  const {
    title,
    subtitle,
    description,
    date,
    time,
    venue,
    registrationLink,
    whatsappLink,
  } = event;

  return (
    <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition mb-6">
      {/* Header */}
      <div className="bg-indigo-600 text-white text-center p-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && <h3 className="text-lg opacity-90">{subtitle}</h3>}
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        <p className="text-gray-700 leading-relaxed">{description}</p>

        {/* Date & Time */}
        <div className="flex justify-between items-center text-gray-800 font-medium border-t pt-3">
          <span>📅 {new Date(date).toLocaleDateString()}</span>
          <span>⏰ {time}</span>
        </div>

        {/* Venue */}
        <div className="flex items-center text-gray-700 border-t pt-3">
          <span className="mr-2">📍</span>
          <span>{venue}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-4 space-y-2 text-center">
        {registrationLink && (
          <a
            href={registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            📝 Register
          </a>
        )}

        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            💬 Join WhatsApp
          </a>
        )}
      </div>
    </div>
  );
};

export default EventsPost;
