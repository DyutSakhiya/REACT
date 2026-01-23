import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ mobile: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, setHotelData } = useAuth();

  // Check for hotelId in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('hotelId');
    
    if (hotelId) {
      document.title = `Hotel ${hotelId} - Login`;
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { mobile, password } = formData;
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('hotelId');
    
    const success = await login(mobile, password);
    
    if (success) {
      // If hotelId was in URL, preserve it
      if (hotelId) {
        navigate(`/admin?hotelId=${hotelId}`);
      } else {
        navigate('/admin');
      }
    } else {
      setError('Invalid credentials. Please try again.');
    }
    
    setIsLoading(false);
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

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="mobile"
              type="text"
              value={formData.mobile}
              onChange={handleChange}
              required
              placeholder="Mobile number"
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

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 mt-2 rounded-full text-white font-semibold text-md bg-orange-500 hover:bg-orange-600 shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Signing in...' : 'Sign in with Mobile'}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Not an admin?{' '}
            <a href="/Register" className="text-orange-600 hover:underline mx-2">
              Go to User Register
            </a>
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