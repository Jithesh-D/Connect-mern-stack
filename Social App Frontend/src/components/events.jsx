import React from "react";
import "./events.css";

const Events = () => {
  return (
    <div className="events-container">
      <div className="event-card">
        <div className="event-header">
          <h1>BEAT THE BOSS 4.0</h1>
          <h2>SIMULTANEOUS TOURNAMENT</h2>
        </div>

        <div className="event-content">
          <div className="event-info">
            <h3>ChessArena presents Beat the Boss</h3>
            <p className="event-description">
              where Dr. Phani Kumar Pullella takes on multiple players in an
              epic simultaneous chess showdown!
            </p>

            <div className="event-details">
              <div className="detail-item">
                <span className="icon">📅</span>
                <span>Date: 20th August 2025</span>
              </div>
              <div className="detail-item">
                <span className="icon">⏰</span>
                <span>Time: 4:15 PM – 6:00 PM</span>
              </div>
              <div className="detail-item">
                <span className="icon">📍</span>
                <span>Venue: B-Block 1st Floor, Multipurpose Hall</span>
              </div>
            </div>

            <div className="event-highlights">
              <p>🏆 Prizes will be awarded to all winners.</p>
            </div>

            <div className="event-registration">
              <p>
                Registration:{" "}
                <a
                  href="https://forms.gle/RPWb9UbAkEZSrZVd9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://forms.gle/RPWb9UbAkEZSrZVd9
                </a>
              </p>
              <p>
                Join Chess Arena Community:{" "}
                <a
                  href="https://chat.whatsapp.com/EP7VBDckn8A652N7Vo66df"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join WhatsApp Group
                </a>
              </p>
            </div>
          </div>

          <div className="event-qr">
            <img src="/qr-code.png" alt="Event Registration QR Code" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
