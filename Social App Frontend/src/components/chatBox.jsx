import React, { useState } from "react";
import Message from "./Message";
import InputBox from "./inputBox";
import { sendMessage } from "../services/botService";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);

  const handleSend = async (userMessage) => {
    setMessages([...messages, { message: userMessage, sender: "user" }]);

    const botResponse = await sendMessage(userMessage);
    setMessages((prev) => [
      ...prev,
      { message: botResponse.reply, sender: "bot" },
    ]);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1, overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <Message key={idx} message={msg.message} sender={msg.sender} />
        ))}
      </div>
      <InputBox onSend={handleSend} />
    </div>
  );
};

export default ChatBox;
