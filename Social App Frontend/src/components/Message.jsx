import React from "react";

const Message = ({ message, sender }) => {
  return (
    <div
      style={{
        textAlign: sender === "bot" ? "left" : "right",
        margin: "10px",
      }}
    >
      <span
        style={{
          display: "inline-block",
          padding: "10px",
          borderRadius: "10px",
          backgroundColor: sender === "bot" ? "#e2e2e2" : "#4caf50",
          color: sender === "bot" ? "#000" : "#fff",
        }}
      >
        {message}
      </span>
    </div>
  );
};

export default Message;
