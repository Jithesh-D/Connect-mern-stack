// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";

// const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
// import { useDarkMode } from "../store/darkModeContext";
// import {
//   Bot,
//   Send,
//   User,
//   Menu,
//   Plus,
//   Search,
//   MessageSquare,
//   MoreVertical,
//   RefreshCw,
//   Wifi,
//   WifiOff,
//   ArrowLeft,
// } from "lucide-react";

// const RVUAssistant = () => {
//   const { isDarkMode } = useDarkMode();

//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm the RVU Assistant. I can help you with information about RV University courses, question papers, faculty, events, placements, and general college information. What would you like to know?",
//       isUser: false,
//       timestamp: new Date(),
//     },
//   ]);
//   const [inputText, setInputText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState("connected");
//   const [connectionError, setConnectionError] = useState("");
//   const [isMobile, setIsMobile] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Detect mobile screen size
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);

//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   const chatHistory = [
//     { id: 1, title: "Course information query", date: "Today" },
//     { id: 2, title: "Placement statistics", date: "Today" },
//     { id: 3, title: "Faculty details", date: "Yesterday" },
//     { id: 4, title: "Library timings", date: "Yesterday" },
//     { id: 5, title: "Event calendar", date: "Last 7 days" },
//     { id: 6, title: "Question papers", date: "Last 7 days" },
//   ];

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Ping backend on mount to check availability
//   useEffect(() => {
//     let mounted = true;
//     const check = async () => {
//       try {
//         const res = await axios.get(`${API}/api/health`);
//         if (!mounted) return;
//         if (res?.data?.status) {
//           setConnectionStatus("connected");
//           setConnectionError("");
//         } else {
//           setConnectionStatus("disconnected");
//           setConnectionError("Health check failed");
//         }
//       } catch (err) {
//         if (!mounted) return;
//         setConnectionStatus("disconnected");
//         setConnectionError(err?.message || "Unable to contact backend");
//         console.warn(
//           "RVU Assistant: backend health check failed:",
//           err?.response || err?.message || err
//         );
//       }
//     };
//     check();
//     return () => (mounted = false);
//   }, []);

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
//     setConnectionStatus("checking");

//     try {
//       console.debug("RVUAssistant: sending message to backend:", {
//         message: userMessage.text,
//       });
//       const res = await axios.post(
//         `${API}/api/bot/ask`,
//         { message: userMessage.text },
//         { withCredentials: true }
//       );

//       const botText =
//         res?.data?.response ||
//         res?.data?.message ||
//         "Sorry, no response from bot.";

//       const botMessage = {
//         id: Date.now() + 1,
//         text: botText,
//         isUser: false,
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botMessage]);
//       setConnectionStatus("connected");
//       setConnectionError("");
//     } catch (err) {
//       console.error(
//         "Error calling bot API:",
//         err?.response || err?.message || err
//       );
//       setConnectionStatus("disconnected");
//       setConnectionError(
//         err?.response?.data?.error || err?.message || "Bot service error"
//       );

//       const botMessage = {
//         id: Date.now() + 1,
//         text:
//           err?.response?.data?.error ||
//           "I'm sorry — the assistant is currently unavailable. Please try again later.",
//         isUser: false,
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botMessage]);
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

//   const suggestions = [
//     "What courses does RVU offer?",
//     "How can I enroll in B-Tech?",
//     "Tell me about RV University",
//     "What courses are available for computer science?",
//   ];

//   const ConnectionStatusBadge = () => {
//     if (connectionStatus === "checking") {
//       return (
//         <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
//           <RefreshCw className="h-3 w-3 text-yellow-400 animate-spin" />
//           <span className="text-xs text-yellow-400">Connecting...</span>
//         </div>
//       );
//     } else if (connectionStatus === "connected") {
//       return (
//         <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
//           <Wifi className="h-3 w-3 text-green-400" />
//           <span className="text-xs text-green-400">Connected</span>
//         </div>
//       );
//     } else {
//       return (
//         <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
//           <WifiOff className="h-3 w-3 text-red-400" />
//           <span className="text-xs text-red-400">Disconnected</span>
//         </div>
//       );
//     }
//   };

//   // Sidebar component
//   const Sidebar = () => (
//     <div
//       className={`w-64 border-r flex flex-col overflow-hidden h-full ${
//         isDarkMode
//           ? "bg-[#171717] border-gray-800"
//           : "bg-gray-50 border-gray-200"
//       }`}
//     >
//       {/* Sidebar Header */}
//       <div
//         className={`p-2 border-b ${
//           isDarkMode ? "border-gray-800" : "border-gray-200"
//         }`}
//       >
//         <button
//           className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-left ${
//             isDarkMode
//               ? "hover:bg-[#2A2A2A] text-white"
//               : "hover:bg-gray-200 text-gray-900"
//           }`}
//         >
//           <Plus className="h-4 w-4" />
//           <span className="text-sm">New chat</span>
//         </button>
//       </div>

//       {/* Search */}
//       <div className="p-2">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search"
//             className={`w-full border-0 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 ${
//               isDarkMode
//                 ? "bg-[#2A2A2A] focus:ring-gray-600 text-white placeholder-gray-500"
//                 : "bg-white focus:ring-gray-300 text-gray-900 placeholder-gray-400 border border-gray-200"
//             }`}
//           />
//         </div>
//       </div>

//       {/* Chat History */}
//       <div className="flex-1 overflow-y-auto px-2">
//         <div className="space-y-0.5 py-2">
//           {chatHistory.map((chat) => (
//             <button
//               key={chat.id}
//               className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left group ${
//                 isDarkMode ? "hover:bg-[#2A2A2A]" : "hover:bg-gray-200"
//               }`}
//             >
//               <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
//               <div className="flex-1 min-w-0">
//                 <p
//                   className={`text-sm truncate ${
//                     isDarkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   {chat.title}
//                 </p>
//               </div>
//               <MoreVertical className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* User Profile */}
//       <div
//         className={`p-2 border-t ${
//           isDarkMode ? "border-gray-800" : "border-gray-200"
//         }`}
//       >
//         <button
//           className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
//             isDarkMode ? "hover:bg-[#2A2A2A]" : "hover:bg-gray-200"
//           }`}
//         >
//           <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
//             <User className="h-4 w-4 text-white" />
//           </div>
//           <div className="flex-1 text-left min-w-0">
//             <p
//               className={`text-sm truncate ${
//                 isDarkMode ? "text-white" : "text-gray-900"
//               }`}
//             >
//               Student
//             </p>
//           </div>
//         </button>
//       </div>
//     </div>
//   );

//   // Mobile overlay for sidebar
//   const MobileSidebarOverlay = () => (
//     <>
//       {/* Sidebar */}
//       <div className="fixed inset-0 z-40 flex">
//         <div
//           className={`w-64 border-r flex flex-col overflow-hidden h-full ${
//             isDarkMode
//               ? "bg-[#171717] border-gray-800"
//               : "bg-gray-50 border-gray-200"
//           }`}
//         >
//           {/* Mobile Sidebar Header */}
//           <div
//             className={`p-2 border-b flex items-center gap-2 ${
//               isDarkMode ? "border-gray-800" : "border-gray-200"
//             }`}
//           >
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className={`p-1.5 rounded-md transition-colors ${
//                 isDarkMode ? "hover:bg-[#2A2A2A]" : "hover:bg-gray-200"
//               }`}
//             >
//               <ArrowLeft className="h-4 w-4" />
//             </button>
//             <span className="text-sm font-medium">Chat History</span>
//           </div>

//           {/* Rest of sidebar content */}
//           <div
//             className={`p-2 border-b ${
//               isDarkMode ? "border-gray-800" : "border-gray-200"
//             }`}
//           >
//             <button
//               className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-left ${
//                 isDarkMode ? "hover:bg-[#2A2A2A]" : "hover:bg-gray-200"
//               }`}
//             >
//               <Plus className="h-4 w-4" />
//               <span className="text-sm">New chat</span>
//             </button>
//           </div>

//           <div className="p-2">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className={`w-full border-0 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 ${
//                   isDarkMode
//                     ? "bg-[#2A2A2A] focus:ring-gray-600 text-white placeholder-gray-500"
//                     : "bg-white focus:ring-gray-300 text-gray-900 placeholder-gray-400"
//                 }`}
//               />
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto px-2">
//             <div className="space-y-0.5 py-2">
//               {chatHistory.map((chat) => (
//                 <button
//                   key={chat.id}
//                   className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left group ${
//                     isDarkMode ? "hover:bg-[#2A2A2A]" : "hover:bg-gray-200"
//                   }`}
//                 >
//                   <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                   <div className="flex-1 min-w-0">
//                     <p
//                       className={`text-sm truncate ${
//                         isDarkMode ? "text-gray-300" : "text-gray-700"
//                       }`}
//                     >
//                       {chat.title}
//                     </p>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Overlay to close sidebar */}
//         <div
//           className="flex-1 bg-black bg-opacity-50"
//           onClick={() => setSidebarOpen(false)}
//         />
//       </div>
//     </>
//   );

//   return (
//     <div
//       className={`flex h-screen ${
//         isDarkMode ? "bg-[#212121] text-white" : "bg-gray-50 text-gray-900"
//       }`}
//     >
//       {/* Desktop Sidebar - Only show on larger screens when open */}
//       {!isMobile && sidebarOpen && <Sidebar />}

//       {/* Mobile Sidebar Overlay */}
//       {isMobile && sidebarOpen && <MobileSidebarOverlay />}

//       {/* Main Content */}
//       <div
//         className={`flex-1 flex flex-col ${
//           !sidebarOpen && !isMobile ? "md:ml-0" : ""
//         }`}
//       >
//         {/* Header */}
//         <div
//           className={`h-12 border-b flex items-center justify-between px-3 ${
//             isDarkMode ? "border-gray-800" : "border-gray-200"
//           }`}
//         >
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className={`p-1.5 rounded-md transition-colors ${
//                 isDarkMode ? "hover:bg-[#2A2A2A]" : "hover:bg-gray-200"
//               }`}
//             >
//               <Menu className="h-5 w-5" />
//             </button>
//             <span className="text-sm font-medium">RVU Assistant</span>
//           </div>
//           <ConnectionStatusBadge />
//         </div>

//         {/* Messages Area */}
//         <div className="flex-1 overflow-y-auto">
//           {messages.length === 1 ? (
//             <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto px-4 pb-32">
//               <div className="mb-6">
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
//                   <Bot className="h-6 w-6 text-white" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-center">
//                   What can I help with?
//                 </h2>

//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl">
//                 {suggestions.map((suggestion, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setInputText(suggestion)}
//                     className={`p-3 rounded-lg text-left transition-colors text-sm ${
//                       isDarkMode
//                         ? "bg-[#2A2A2A] hover:bg-[#333333]"
//                         : "bg-white hover:bg-gray-100 border border-gray-200"
//                     }`}
//                   >
//                     {suggestion}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="max-w-3xl mx-auto px-4 py-6">
//               <div className="space-y-4">
//                 {messages.map((message) => (
//                   <div
//                     key={message.id}
//                     className={`flex gap-3 ${
//                       message.isUser ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     {!message.isUser && (
//                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
//                         <Bot className="h-4 w-4 text-white" />
//                       </div>
//                     )}
//                     <div
//                       className={`max-w-[85%] ${
//                         message.isUser
//                           ? isDarkMode
//                             ? "bg-[#2A2A2A] rounded-2xl px-4 py-2.5"
//                             : "bg-blue-600 text-white rounded-2xl px-4 py-2.5"
//                           : ""
//                       }`}
//                     >
//                       <p className="text-sm leading-relaxed whitespace-pre-wrap">
//                         {message.text}
//                       </p>
//                     </div>
//                     {message.isUser && (
//                       <div
//                         className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
//                           isDarkMode ? "bg-[#2A2A2A]" : "bg-gray-200"
//                         }`}
//                       >
//                         <User className="h-4 w-4" />
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 {isLoading && (
//                   <div className="flex gap-3">
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//                       <Bot className="h-4 w-4 text-white" />
//                     </div>
//                     <div className="flex items-center gap-1 py-2">
//                       <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
//                       <div
//                         className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.1s" }}
//                       ></div>
//                       <div
//                         className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.2s" }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}

//                 <div ref={messagesEndRef} />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Input Area */}
//         <div
//           className={`border-t p-4 ${
//             isDarkMode ? "border-gray-800" : "border-gray-200"
//           }`}
//         >
//           <div className="max-w-3xl mx-auto">
//             <div
//               className={`relative flex items-center gap-2 rounded-2xl border transition-colors ${
//                 isDarkMode
//                   ? "bg-[#2A2A2A] border-gray-700 focus-within:border-gray-600"
//                   : "bg-white border-gray-300 focus-within:border-blue-500"
//               }`}
//             >
//               <textarea
//                 value={inputText}
//                 onChange={(e) => setInputText(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Message RVU Assistant"
//                 rows="1"
//                 className={`flex-1 bg-transparent px-4 py-3 focus:outline-none resize-none text-sm max-h-32 ${
//                   isDarkMode
//                     ? "text-white placeholder-gray-500"
//                     : "text-gray-900 placeholder-gray-400"
//                 }`}
//                 style={{ minHeight: "44px" }}
//                 disabled={connectionStatus !== "connected"}
//               />
//               <button
//                 onClick={handleSendMessage}
//                 disabled={
//                   !inputText.trim() ||
//                   isLoading ||
//                   connectionStatus !== "connected"
//                 }
//                 className={`mr-2 p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
//                   isDarkMode
//                     ? "bg-blue-600 text-white hover:bg-blue-700"
//                     : "bg-blue-600 text-white hover:bg-blue-700"
//                 }`}
//               >
//                 <Send className="h-4 w-4" />
//               </button>
//             </div>
//             <p className="text-xs text-gray-500 text-center mt-2">
//               RVU Assistant can make mistakes. Check important info.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RVUAssistant;
