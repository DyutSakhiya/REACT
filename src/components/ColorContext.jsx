import React, { createContext, useState, useContext } from "react";

const ColorContext = createContext();

export const useColor = () => useContext(ColorContext);

export const ColorProvider = ({ children }) => {
  const [bgColor, setBgColor] = useState("white"); 

  return (
    <ColorContext.Provider value={{ bgColor, setBgColor }}>
      {children}
    </ColorContext.Provider>
  );
};
