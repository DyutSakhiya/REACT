import React, { useRef } from "react";

function Counter() {
  const countRef = useRef(0);
  const inputRef = useRef(null);

  const handleIncrement = () => {
    countRef.current += 1;
    console.log("Count :", countRef.current);
  };

  const handleClick = () => {
    inputRef.current.focus();
  };

  return (
    <div className="div">
      <div className=" flex justify-center mt-5  ">
        <button
          className=" h-10 rounded bg-gray-600 hover:bg-gray-600"
          onClick={handleIncrement}
        >
          Increment
        </button>
      </div>
      <div className="flex justify-center py-6">
        <input
          ref={inputRef}
          className=" px-5 py-2   border border-gray-600 rounded-md focus:outline-none focus:ring-2 "
          type="text"
          name=""
          id=""
        />
        <button
          onClick={handleClick}
          className="  w-16 ml-3   border border-gray-600  rounded-md hover:bg-green-600"
        >
          {" "}
          input
        </button>
      </div>
    </div>
  );
}

export default Counter;
