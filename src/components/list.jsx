import React, { useState } from "react";

function List() {
  const [leftItems, setLeftItems] = useState(["One", "Two", "Three", "Four"]);
  const [rightItems, setRightItems] = useState(["", "", "", ""]);

  const moveRight = (index) => {
    if (leftItems[index]) {
      const newRightItems = [...rightItems];
      newRightItems[index] = leftItems[index];
      
      const newLeftItems = [...leftItems];
      newLeftItems[index] = "";
      
      setRightItems(newRightItems);
      setLeftItems(newLeftItems);
    }
  };

  const moveLeft = (index) => {
    if (rightItems[index]) {
      const newLeftItems = [...leftItems];
      newLeftItems[index] = rightItems[index];
      
      const newRightItems = [...rightItems];
      newRightItems[index] = "";
      
      setLeftItems(newLeftItems);
      setRightItems(newRightItems);
    }
  };

  const moveAllRight = () => {
    setRightItems([...leftItems]);
    setLeftItems(["", "", "", ""]);
  };

  const moveAllLeft = () => {
    setLeftItems([...rightItems]);
    setRightItems(["", "", "", ""]);
  };

  return (
    <>
      <div className="flex justify-center cursor-pointer">
        <div>
          <div className="flex">
            <div className="h-[50px] w-[160px] border py-2 px-14 border-black mt-5 ml-4 hover:bg-gray-500">
              {leftItems[0]}
            </div>
            <button
              onClick={() => leftItems[0] && moveRight(0)}
              className="h-[50px] w-[100px] bg-blue-600 hover:bg-blue-800 flex-row rounded-full ml-4 mt-5 text-white"
            >
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-8"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          <div className="flex">
            <div className="h-[50px] w-[160px] border py-2 px-14 border-black mt-5 ml-4 hover:bg-gray-500">
              {leftItems[1]}
            </div>
            <button
              onClick={() => RightItems[1] && moveLeft(1)}
              className="h-[50px] w-[100px] bg-green-600 hover:bg-green-800 flex-row rounded-full ml-4 mt-5 text-white"
            >
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-8"
              >
                <path d="M19 12H5"></path>
                <path d="M12 19l-7-7 7-7"></path>
              </svg>
            </button>
          </div>
          <div className="flex">
            <div className="h-[50px] w-[160px] border py-2 px-14 border-black mt-5 ml-4 hover:bg-gray-500">
              {leftItems[2]}
            </div>
            <button
              onClick={() => leftItems[2] && moveRight(2)}
              className="h-[50px] w-[100px] bg-red-600 hover:bg-red-800 flex-row rounded-full ml-4 mt-5 text-white"
            >
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-8"
              >
                <path d="M6 4l6 8-6 8"></path>
                <path d="M13 4l6 8-6 8"></path>
              </svg>
            </button>
          </div>
          <div className="flex">
            <div className="h-[50px] w-[160px] border py-2 px-14 border-black mt-5 ml-4 hover:bg-gray-500">
              {leftItems[3]}
            </div>
            <button
              onClick={() => RightItems[3] && moveLeft(3)}
              className="h-[50px] w-[100px] bg-amber-300 hover:bg-amber-600 flex-row rounded-full ml-4 mt-5 text-white"
            >
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-8"
              >
                <path d="M18 4l-6 8 6 8"></path>
                <path d="M11 4l-6 8 6 8"></path>
              </svg>
            </button>
          </div>
        </div>
        <div>
          <div className="h-[50px] w-[160px] border py-2 px-14 border-black mt-5 ml-4 hover:bg-gray-500">
            {rightItems[0]}
          </div>
          <div className="h-[50px] w-[160px] border py-2 px-14 border-black mt-5 ml-4 hover:bg-gray-500">
            {rightItems[1]}
          </div>
          <div className="h-[50px] w-[160px] border py-2 px-14 border-black mt-5 ml-4 hover:bg-gray-500">
            {rightItems[2]}
          </div>
          <div className="h-[50px] w-[160px] border py-2 px-14 border-black mt-5 ml-4 hover:bg-gray-500">
            {rightItems[3]}
          </div>
        </div>
      </div>
    </>
  );
}

export default List;