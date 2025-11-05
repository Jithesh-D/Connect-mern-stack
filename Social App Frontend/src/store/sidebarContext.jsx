import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [rightSidebarVisible, setRightSidebarVisible] = useState(true);
  const [leftSidebarMenuVisible, setLeftSidebarMenuVisible] = useState(true);

  const hideRightSidebar = () => {
    setRightSidebarVisible(false);
    setLeftSidebarMenuVisible(true);
  };

  const hideLeftSidebarMenu = () => {
    setLeftSidebarMenuVisible(false);
    setRightSidebarVisible(true);
  };

  const resetSidebars = () => {
    setRightSidebarVisible(true);
    setLeftSidebarMenuVisible(true);
  };

  return (
    <SidebarContext.Provider value={{
      rightSidebarVisible,
      leftSidebarMenuVisible,
      hideRightSidebar,
      hideLeftSidebarMenu,
      resetSidebars
    }}>
      {children}
    </SidebarContext.Provider>
  );
};