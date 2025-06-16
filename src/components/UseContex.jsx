import React, { createContext, useState, useContext } from "react";

const ColorContext = createContext();

const useColor = () => useContext(ColorContext);

const ColorProvider = ({ children }) => {
  
  const [bgColor, setBgColor] = useState("white");

  return (
    <ColorContext.Provider value={{ bgColor, setBgColor }}>
      {children}
    </ColorContext.Provider>
  );
};

function UseContext() {
  const { bgColor, setBgColor } = useColor();

  const handleOnClick = () => {
    alert("Color is Change");
    setBgColor(bgColor === "white" ? "blue" : "white");
  };

  return (
    <div className="flex justify-center">
      <div
        className="w-64 h-64 border border-gray-600 flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <button
          onClick={handleOnClick}
          className="border border-black bg-blue-400 text-black px-4 py-2 rounded"
        >
          Click Me
        </button>
      </div>
    </div>
  );
}
export { ColorProvider };
export default UseContext;


