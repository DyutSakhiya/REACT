import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

const Home = () => {
  const { hotelId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // You can fetch hotel-specific products here if needed
    if (hotelId) {
      console.log("Loading data for hotel:", hotelId);
      // Fetch hotel-specific data
    }
  }, [hotelId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to Our Restaurant
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Discover delicious foods and place your order
          </p>
          {hotelId && (
            <div className="inline-block bg-green-700 bg-opacity-50 px-4 py-2 rounded-full">
              <span className="text-sm">Hotel ID: {hotelId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Our Menu Categories
          </h2>
          <p className="text-gray-600">
            Browse through our delicious food items
          </p>
        </div>

        {/* Add your existing menu content here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Your existing menu items */}
        </div>
      </div>
    </div>
  );
};

export default Home;