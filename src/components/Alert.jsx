import React, { useState } from 'react';

const AlertBox = () => {
  const [showAlert, setShowAlert] = useState(true);

  const handleClose = () => {
    setShowAlert(false);
  };

  return (
    <div className="flex justify-center    w-full bg-gray-700">
      {showAlert && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 w-full rounded relative  shadow-md" role="alert">
          <strong className="font-bold">Info: </strong>
          <span className="block sm:inline">This is an alert message!</span>
          <button
            onClick={handleClose}
            className=" text-blue-500 hover:text-blue-700  mx-[50px]"
          >
            x
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertBox;
