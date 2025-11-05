// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// // --- MAIN REACT COMPONENT ---
// function Intro() {
//   const [isLoaded, setIsLoaded] = useState(false);

//   // This effect runs once to detect when all page assets are loaded.
//   useEffect(() => {
//     const handleLoad = () => {
//       // Set the loaded state to true to trigger the animations
//       setIsLoaded(true);
//     };

//     // Check if the window is already loaded
//     if (document.readyState === "complete") {
//       handleLoad();
//     } else {
//       // Otherwise, add an event listener
//       window.addEventListener("load", handleLoad);
//     }

//     // Cleanup the event listener when the component unmounts
//     return () => {
//       window.removeEventListener("load", handleLoad);
//     };
//   }, []); // The empty array ensures this effect runs only once

//   const navigate = useNavigate();
//   return (
//     <>
//       {/* --- ALL CSS STYLES ARE EMBEDDED HERE --- */}
//       <style>{`

//         body, html, #root {
//             margin: 0;
//             padding: 0;
//             width: 100%;
//             height: 100%;
//             font-family: Arial, sans-serif; /* Replace with your desired font */
//             background-image: url('/background_image.jpg'); /* Background image path */
//             overflow: hidden;
//         }

//         .app-container {
//             width: 100%;
//             height: 100%;
//             position: relative;
//         }

//         /* 1. The Loader */
//         .loader {
//             position: fixed;
//             top: 0;
//             left: 0;
//             width: 100%;
//             height: 100%;
//             background-color: #fff;
//             z-index: 1000;
//             transition: opacity 1s ease-in-out;
//         }

//         /* 2. Main Content Wrapper */
//         .main-content {
//             width: 100%;
//             height: 100%;
//             position: relative;
//             color: #fff;
//         }

//         /* 4. Header / Navigation */
//         header {
//             position: absolute;
//             top: 0;
//             left: 0;
//             width: 100%;
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 20px 40px;
//             box-sizing: border-box;
//             z-index: 10;
//             opacity: 0; /* Hidden initially */
//             transition: opacity 1s ease-in-out 0.5s; /* Fade in after 0.5s delay */
//         }

//         .logo-nav {
//             font-weight: bold;
//             font-size: 1.5rem;
//         }

//         nav a {
//             color: #fff;
//             text-decoration: none;
//             margin-left: 20px;
//             font-weight: bold;
//         }

//         /* 5. Hero Content (Logo, Button, Socials) */
//         .hero-content {
//             display: flex;
//             flex-direction: column;
//             justify-content: center;
//             align-items: center;
//             height: 100vh;
//             text-align: center;
//             position: relative;
//             z-index: 5;
//         }

//         .hero-logo {
//             width: 400px; /* Adjust size as needed */
//             max-width: 90%;
//             opacity: 0; /* Hidden initially */
//             animation: fadeIn 1s ease-out 0.2s forwards; /* Fades in after 0.2s */
//         }

//         .app-container.loaded .hero-logo {
//             /* After fade-in, start the bounce animation */
//             animation: fadeIn 1s ease-out 0.2s forwards,
//                        bounce 2s infinite ease-in-out 1.2s; /* Bounce after fade-in completes */
//         }

//         .cta-button {
//             background-color: #d9534f; /* Example color */
//             color: #fff;
//             padding: 10px 20px;
//             text-decoration: none;
//             font-weight: bold;
//             margin-top: 20px; /* Reverted from margin-bottom */
//             border-radius: 5px;
//             opacity: 0; /* Hidden initially */
//             animation: fadeIn 1s ease-out 0.7s forwards; /* Fades in after 0.7s */
//             transition: transform 0.3s ease;
//         }

//         .cta-button:hover {
//             transform: scale(1.05); /* Reverted to original hover */
//         }

//         .social-links {
//             margin-top: 20px; /* Reverted from margin-bottom */
//             opacity: 0; /* Hidden initially */
//             transition: opacity 1s ease-in-out 0.5s;
//         }

//         .social-links a {
//             color: #fff;
//             text-decoration: none;
//             margin: 0 10px;
//             font-size: 1.5rem; /* Adjust for icons */
//             transition: transform 0.3s ease;
//             display: inline-block;
//         }

//         .social-links a:hover {
//           transform: scale(1.1); /* Reverted to original hover */
//         }

//         /* 6. Footer */
//         footer {
//             position: absolute;
//             bottom: 20px;
//             left: 40px;
//             font-size: 0.9rem;
//             opacity: 0; /* Hidden initially */
//             transition: opacity 1s ease-in-out 0.5s;
//         }

//         /* 7. Animation Keyframes */
//         @keyframes fadeIn {
//             from {
//                 opacity: 0;
//                 transform: scale(0.95);
//             }
//             to {
//                 opacity: 1;
//                 transform: scale(1);
//             }
//         }

//         @keyframes bounce {
//             0%, 100% {
//                 transform: translateY(0);
//             }
//             50% {
//                 transform: translateY(-10px); /* Adjust bounce height */
//             }
//         }

//         /* 8. The "Loaded" State - This triggers the animations */
//         .app-container.loaded .loader {
//             opacity: 0;
//             pointer-events: none; /* Allows clicking through the faded loader */
//         }

//         .app-container.loaded header,
//         .app-container.loaded .social-links,
//         .app-container.loaded footer {
//             opacity: 1;
//         }
//       `}</style>

//       {/* --- JSX PAGE STRUCTURE --- */}
//       <div className={`app-container ${isLoaded ? "loaded" : ""}`}>
//         <div className="loader"></div>

//         <div className="main-content">
//           <header>
//             <div className="logo-nav">RVU C</div>
//             <button
//               onClick={() => navigate("/signup")}
//               className="text-white font-bold ml-5"
//             >
//               POST
//             </button>
//             <button
//               onClick={() => navigate("/signup")}
//               className="text-white font-bold ml-5"
//             >
//               EVENTS
//             </button>
//             <button
//               onClick={() => navigate("/signup")}
//               className="text-white font-bold ml-5"
//             >
//               COLLAB HUB
//             </button>
//             <button
//               onClick={() => navigate("/signup")}
//               className="text-white font-bold ml-5"
//             >
//               ABOUT
//             </button>
//           </header>

//           <main className="hero-content">
//             {/* --- REVERTED ORDER --- */}
//             {/* Elements are now BELOW the logo */}

//             {/* LOGO PLACEHOLDER:
//               Using a placeholder because the preview can't access local files.
//               Replace the 'src' below with your actual logo path (e.g., "/rvu-connect-logo.png")
//               when you are ready.
//             */}
//             <img
//               src="rvuuu"
//               alt="RVU CONNECT Logo Placeholder"
//               className="hero-logo"
//             />
//             <button onClick={() => navigate("/signup")} className="cta-button">
//               Get Started
//             </button>

//             {/* --- END OF REVERTED ORDER --- */}
//           </main>

//           <footer>Website by Jithesh.D</footer>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Intro;
