// import React, { useState, useRef, useEffect } from "react";
// import { useDarkMode } from "../store/darkModeContext";
// // Assuming BotServices.js is in the same directory or adjust the path
// // import { sendMessage } from "../services/BotServices";

// // Mock function if BotServices isn't set up yet
// const sendMessage = async (message) => {
//   console.log("Sending message:", message);
//   await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
//   return `This is a simulated response to: "${message}"`;
// };

// // A simple bot avatar component
// const BotAvatar = () => (
//   <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
//     <svg
//       className="w-5 h-5 text-white"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.373 3.373 0 0012 18.373a3.373 3.373 0 00-2.253-1.026l-.548-.547z"
//       />
//     </svg>
//   </div>
// );

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm your college assistant. I can help you with information about courses, question papers, faculty, and general college information. What would you like to know?",
//       isUser: false,
//       timestamp: new Date(),
//     },
//   ]);
//   const [inputText, setInputText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!inputText.trim() || isLoading) return;

//     const userMessage = {
//       id: Date.now(),
//       text: inputText.trim(),
//       isUser: true,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputText("");
//     setIsLoading(true);

//     try {
//       const response = await sendMessage(inputText.trim());
//       const botMessage = {
//         id: Date.now() + 1,
//         text: response,
//         isUser: false,
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       const errorMessage = {
//         id: Date.now() + 1,
//         text: "Sorry, I'm having trouble connecting. Please try again later.",
//         isUser: false,
//         timestamp: new Date(),
//         isError: true,
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const { isDarkMode } = useDarkMode();

//   return (
//     <>
//       {/* Chatbot Toggle Button */}
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className={`hidden md:block fixed bottom-5 right-5 p-4 rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 ${
//             isDarkMode
//               ? "bg-gray-800 text-white hover:bg-gray-700"
//               : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
//           }`}
//           aria-label="Open chat"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
//             />
//           </svg>
//         </button>
//       )}

//       {/* Chatbot Modal */}
//       {isOpen && (
//         <div
//           className={`fixed bottom-5 right-5 w-[400px] h-[600px] rounded-2xl shadow-2xl flex flex-col z-50 ${
//             isDarkMode
//               ? "bg-gray-900 text-white"
//               : "bg-white text-gray-900 border border-gray-200"
//           }`}
//         >
//           {/* Header */}
//           <div
//             className={`p-4 border-b ${
//               isDarkMode ? "border-gray-700" : "border-gray-200"
//             }`}
//           >
//             <div className="flex justify-between items-center">
//               <h3 className="font-semibold text-lg">College Assistant</h3>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="text-gray-400 hover:text-white transition-colors"
//                 aria-label="Close chat"
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Messages */}
//           <div
//             className={`flex-1 overflow-y-auto p-4 ${
//               isDarkMode ? "bg-gray-800" : "bg-gray-50"
//             }`}
//           >
//             <div className="space-y-6">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex items-start text-sm ${
//                     message.isUser ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   {!message.isUser && <BotAvatar />}
//                   <div
//                     className={`max-w-[85%] rounded-lg px-4 py-2 ${
//                       message.isUser
//                         ? "bg-gray-700"
//                         : message.isError
//                         ? "bg-red-900/50 text-red-300"
//                         : "bg-gray-800"
//                     }`}
//                   >
//                     <p className="whitespace-pre-wrap">{message.text}</p>
//                     <p className="text-xs mt-1 text-gray-500 text-right">
//                       {message.timestamp.toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </p>
//                   </div>
//                 </div>
//               ))}

//               {isLoading && (
//                 <div className="flex items-start">
//                   <BotAvatar />
//                   <div className="bg-gray-700 rounded-lg px-4 py-3">
//                     <div className="flex items-center justify-center space-x-1">
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                       <div
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.1s" }}
//                       ></div>
//                       <div
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.2s" }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>
//           </div>

//           {/* Input Area */}
//           <div className="p-4 border-t border-gray-700">
//             <div className="relative">
//               <input
//                 type="text"
//                 value={inputText}
//                 onChange={(e) => setInputText(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Ask me anything..."
//                 className={`w-full pl-4 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
//                   isDarkMode
//                     ? "border-gray-600 focus:ring-gray-500 bg-gray-700 text-gray-100"
//                     : "border-gray-300 focus:ring-blue-500 bg-white text-gray-900"
//                 }`}
//                 disabled={isLoading}
//               />
//               <button
//                 onClick={handleSendMessage}
//                 disabled={!inputText.trim() || isLoading}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-600 text-white p-2 rounded-md hover:bg-gray-500 focus:outline-none disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
//                 aria-label="Send message"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 10l7-7m0 0l7 7m-7-7v18"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Chatbot;
