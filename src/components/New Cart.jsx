import React, { useState, useEffect } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const removeFromCart = (index) => {
    setCartItems(prevItems => {
      const updatedCart = prevItems.filter((_, i) => i !== index);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return (
    <div className="container mx-auto p-6 ">
      <h2 className="text-xl font-semibold mb-4 flex justify-center">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center ">
          <p className="text-gray-600 mb-4">You have not selected any product</p>
          <a href="/shop" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ml-52  ">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="p-5  border rounded-lg shadow-lg flex flex-col  relative  bg-white w-44"
            >
              <button
                onClick={() => removeFromCart(index)}
                className="absolute top-1 right-1 bg-red-500 text-white px-3 py-1 rounded-full text-xs hover:bg-red-600 transition"
              >
                ✕
              </button>
              <img
                src={item.image}
                alt={item.title}
              />
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="text-gray-700 text-sm mt-2 ">{item.description}</p>

             <div className="spa">
             <button
            
            className="mt-2 tb-10 w-25 bg-blue-600 mb text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Check out
          </button>
             </div>
            </div>
           
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
