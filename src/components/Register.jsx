import React from "react";

function Register({ Data, setData, goToLogin }) {
  const handleChange = (e) => {
    setData({ ...Data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    goToLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-sm space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 tracking-wide">
          Register
        </h2>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            First Name:
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={Data.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <label className="block text-sm font-semibold text-gray-700">
            Last Name:
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={Data.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <label className="block text-sm font-semibold text-gray-700">
            Address:
          </label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={Data.address}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <label className="block text-sm font-semibold text-gray-700">
            Mobile Number:
          </label>
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={Data.mobile}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 mt-4 rounded-xl hover:bg-purple-700 transition duration-300 shadow-md font-semibold"
          >
            Submit
          </button>

          <p className="text-center text-sm text-gray-600 mt-2">
            Already registered?{" "}
            <button
              type="button"
              onClick={goToLogin}
              className="text-purple-600 font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
