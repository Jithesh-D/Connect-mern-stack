import React from "react";
import { IMAGE_BASE_URL } from "../config";

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
    image,
  } = event;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
      {/* Photo Section */}
      {image && (
        <div className="w-full h-64 overflow-hidden">
          <img
            src={`${IMAGE_BASE_URL}${image}`}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <h3 className="text-xl text-indigo-600 mt-2">{subtitle}</h3>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">{description}</p>

          <div className="space-y-2">
            <div className="flex items-center text-gray-700">
              <span className="mr-2">📅</span>
              <span>{new Date(date).toLocaleDateString()}</span>
              <span className="mx-2">⏰</span>
              <span>{time}</span>
            </div>

            <div className="flex items-center text-gray-700">
              <span className="mr-2">📍</span>
              <span>{venue}</span>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            {registrationLink && (
              <a
                href={registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-indigo-600 hover:text-indigo-500"
              >
                📝 Register for Event
              </a>
            )}

            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-green-600 hover:text-green-500"
              >
                💬 Join WhatsApp Group
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPost;
