import React, { useState } from "react";

export default function TextForm(props) {
  const handleClick = (newText) => {
    setText(newText);
  };

  const [text, setText] = useState("Enter text here");

  return (
    <>
      <div className="container">
        <h1 className="text-4xl mt-18">Enter text </h1>
        <div className="p-4">
          <textarea
            className="mt-1 w-full h-[300px] rounded-md border-black text-2xl border-[3px] border-solid"
            value={text}
            readOnly
          ></textarea>
        </div>
        <button
          className="btn btn-primary mt-5 bg-blue-600 text-white hover:bg-blue-800 hover:underline h-12 w-[190px] font-bold rounded-full mx-5"
          onClick={() => handleClick("Hii!")}
        >
          Hii
        </button>
        <button
          className="btn btn-primary mt-5 bg-green-500 text-white hover:bg-green-700 hover:underline h-12 w-[190px] font-bold rounded-full mx-5"
          onClick={() => handleClick("Hello!")}
        >
          Hello
        </button>
        <button
          className="btn btn-primary mt-5 bg-red-600 text-white hover:bg-red-700 hover:underline h-12 w-[190px] font-bold rounded-full mx-5"
          onClick={() => handleClick("How are you?")}
        >
          How are you?
        </button>
        <button
          className="btn btn-primary mt-5 bg-gray-700 text-white hover:bg-black hover:underline h-12 w-[190px] font-bold rounded-full mx-5"
          onClick={() => handleClick("Bye Bye!")}
        >
          Bye Bye
        </button>
      </div>
    </>
  );
}
