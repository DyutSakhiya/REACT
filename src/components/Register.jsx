import React from "react";

function Register({ goToLogin }) {
  const handleSubmit = (e) => {
    goToLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-600">
      <div className="div">
        <form className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Register
          </h2>

          <div className="space-y-2">
            <label className="block text-sm font-medium  text-gray-700">
              First Name:
            </label>

            <input
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-sm font-medium  text-gray-700">
              Last Name:
            </label>

            <input
              type="text"
              placeholder="Last Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-sm font-medium  text-gray-700">
              Address:
            </label>

            <input
              type="text"
              placeholder="Address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-sm font-medium  text-gray-700">
              Mobile Number:
            </label>

            <input
              type="tel"
              placeholder="Mobile Number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              onClick={goToLogin}
              className="w-full  bg-blue-600 text-white py-2  rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
