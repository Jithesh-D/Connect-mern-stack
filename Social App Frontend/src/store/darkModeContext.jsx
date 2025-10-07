import React, { createContext, useState, useEffect, useContext } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Read either modern 'darkMode' key or legacy 'theme' key (backwards compatibility)
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode != null) return JSON.parse(savedMode);
    const legacy = localStorage.getItem("theme");
    if (legacy === "dark") return true;
    if (legacy === "light") return false;
    return false;
  });

  useEffect(() => {
    // Persist both modern and legacy keys so components or external scripts keep working
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      // Make page background black to ensure full-page dark look
      document.body.style.backgroundColor = "#000";
      document.body.style.color = "#fff";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};
