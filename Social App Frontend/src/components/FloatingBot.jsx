import React, { useState } from "react";
import Chatbot from "./chatBot";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        className="btn btn-primary rounded-circle position-fixed"
        style={{
          bottom: "2px",
          right: "2px",
          width: "6px",
          height: "6px",
          zIndex: 1000,
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fas ${isOpen ? "fa-times" : "fa-robot"}`}></i>
      </button>

      {/* Chatbot modal */}
      {isOpen && (
        <div
          className="position-fixed"
          style={{
            bottom: "9px",
            right: "2px",
            width: "3px",
            height: "5px",
            zIndex: 1000,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          {/* <Chatbot /> */}
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
