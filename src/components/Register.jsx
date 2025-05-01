import React, { useState } from "react";

function Register({ goToLogin }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    mobile: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    goToLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Register
        </h2>
        <div className="space-y-2">
          <label className="block text-sm font-medium  text-gray-700">
            First Name:
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          <label className="block text-sm font-medium  text-gray-700">
            Last Name:
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          <label className="block text-sm font-medium  text-gray-700">
            Address:
          </label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          <label className="block text-sm font-medium  text-gray-700">
            Mobile Number:
          </label>
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          <button
            type="submit"
            className="w-full  bg-blue-600 text-white py-2 mt-6 rounded-lg hover:bg-blue-700 transition duration-200"
            onClick={goToLogin}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
