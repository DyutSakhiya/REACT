import React from "react";

function Login({ Data, setData }) {
  const handleChange = (e) => {
    setData({ ...Data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
      e.preventDefault();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 tracking-wide">
          Login
        </h2>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Username:
          </label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={Data.username}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />

          <label className="block text-sm font-semibold text-gray-700">
            Email-ID:
          </label>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={Data.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />

          <label className="block text-sm font-semibold text-gray-700">
            Password:
          </label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={Data.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition duration-300 shadow-md font-semibold"
          >
            Submit
          </button>
        </div>

        <div className="bg-gray-300 p-6 rounded-xl shadow-inner mt-8">
          <h3 className="text-lg font-bold text-gray-600 mb-4 text-center">
            User Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
            <p>
              <span className="font-semibold">First Name:</span> {Data.firstName}
            </p>
            <p>
              <span className="font-semibold">Last Name:</span> {Data.lastName}
            </p>
            <p>
              <span className="font-semibold">Address:</span> {Data.address}
            </p>
            <p>
              <span className="font-semibold">Mobile:</span> {Data.mobile}
            </p>
            <p>
              <span className="font-semibold">Username:</span> {Data.username}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {Data.email}
            </p>
            <p>
              <span className="font-semibold">Password:</span> {Data.password}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
