import React from "react";
import { useSelector } from "react-redux";


const Cart = () => {
  const cartItems = useSelector((state) => state.cart);

  if (!cartItems.length) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center text-gray-400 text-xl">
          🎬 Your cart is empty.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">
        🎥 Your Movie List
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {cartItems.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-900 text-white rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <img
              src={movie.image}
              alt={movie.title}
              className="w-60 h-72 object-cover mx-20 my-4"
            />
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
              <p className="text-sm text-gray-400">{movie.category}</p>
              <button className="mt-2 inline-block text-sm px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">
                Play Move 
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
