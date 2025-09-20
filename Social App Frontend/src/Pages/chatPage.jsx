import React from "react";
import Chatbot from "../components/chatBot";

const ChatbotPage = () => {
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
              <h4 className="card-title mb-0">
                <i className="fas fa-robot me-2"></i>
                RVU Connect Assistant
              </h4>
              <small className="opacity-75">
                AI-powered campus information bot
              </small>
            </div>
            <div className="card-body p-0">
              <Chatbot />
            </div>
          </div>

          <div className="mt-4">
            <div className="alert alert-info">
              <h6 className="alert-heading">
                <i className="fas fa-info-circle me-2"></i>
                About RVU Assistant
              </h6>
              <p className="mb-0 small">
                This chatbot can fetch real-time information from RVU websites
                and provide summarized responses. It connects to the backend
                server to retrieve the latest campus updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
