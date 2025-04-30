import React from "react";

function Login({ goToRegister }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-600">
      <div className="div">
        <form className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            LOGIN
          </h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium  text-gray-700">
              User Name:
            </label>

            <input
              type="text"
              placeholder="User name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium  text-gray-700">
              Email-ID:
            </label>
            <input
              type="email"
              placeholder="Email ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium  text-gray-700">
              Passowrd:
            </label>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              onClick={goToRegister}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
