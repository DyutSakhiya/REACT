import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (username === 'admin' && password === 'admin123') {
      login(username, password); 
      toast.success('Admin logged in!');
      navigate('/admin'); 
    } else {
      toast.error('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen flex items-center justify-center bg-opacity-90 backdrop-blur-sm px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <img src="/food-logo.png" alt="Admin Logo" className="mx-auto w-24 h-24 rounded-full" />
            <h2 className="text-3xl font-bold text-orange-700 mt-4">Admin Login - Flavaro</h2>
            <p className="text-sm text-orange-600 mt-1">Sign in to manage the dashboard 🛠️</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Admin username"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
            />

            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 text-orange-600 rounded" />
                Remember me
              </label>
              <a href="/forgot-password" className="text-orange-600 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-full text-white font-semibold text-md bg-orange-500 hover:bg-orange-600 shadow-lg"
            >
              Sign in as Admin
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Not an admin?{' '}
            <a href="/login" className="text-orange-600 hover:underline mx-2">Go to User Login</a>
          </p>

          <p className="text-center text-xs text-white mt-6">
            © 2025 Flavaro Admin. Powered with 🛠️
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
