import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import ItemCard from "./ItemCard";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Axios from "axios";

const API_URL = "https://backend-inky-gamma-67.vercel.app/api";
// const API_URL = "http://localhost:4000/api";

const Cart = () => {
  const [activeCart, setActiveCart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddedBar, setShowAddedBar] = useState(false);

  const cartItems = useSelector((state) => state.cart.cart);
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hotel_id = searchParams.get("hotel_id") || user?.hotelId || "hotel_001";
  const tableNumber = searchParams.get("table_id") || "N/A";

  const totalQty = cartItems.reduce((t, i) => t + i.qty, 0);
  const totalPrice = cartItems.reduce(
    (t, i) => t + i.qty * i.price,
    0
  );

  useEffect(() => {
    if (totalQty > 0) {
      setShowAddedBar(true);
    } else {
      setShowAddedBar(false);
    }
  }, [totalQty]);

  const handleCheckout = async () => {
    if (isProcessing || cartItems.length === 0) return;

    setIsProcessing(true);
    const username = user?.username || "guest";

    try {
      const pendingResponse = await Axios.get(
        `${API_URL}/orders/pending/${hotel_id}/${tableNumber}`
      );

      if (pendingResponse.data.success && pendingResponse.data.order) {
        await Axios.put(
          `${API_URL}/orders/${pendingResponse.data.order._id}/add-items`,
          { cartItems, total: totalPrice }
        );

        navigate("/success", {
          state: {
            orderId: pendingResponse.data.order.orderId,
            hotelId: hotel_id,
            tableNumber,
            merged: true,
          },
        });
      } else {
        const response = await Axios.post(`${API_URL}/orders`, {
          userId: username,
          hotelId: hotel_id,
          cartItems,
          total: totalPrice,
          tableNumber,
        });

        navigate("/success", {
          state: {
            orderId: response.data.orderId,
            hotelId: hotel_id,
            tableNumber,
            merged: false,
          },
        });
      }
    } catch (err) {
      alert("Order failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div
        className={`fixed right-0 top-0 w-full md:w-[450px] h-full p-5 bg-white shadow-2xl ${
          activeCart ? "translate-x-0" : "translate-x-full"
        } transition-all duration-500 z-50`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Order</h2>
          <IoMdClose
            onClick={() => setActiveCart(false)}
            className="text-2xl cursor-pointer hover:text-red-500 transition-colors"
          />
        </div>

        <div className="h-[65vh] overflow-y-auto pr-2">
          {cartItems.length ? (
            cartItems.map((food, index) => (
              <ItemCard key={index} {...food} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-6xl text-gray-300 mb-4">🛒</div>
              <p className="text-gray-500 font-semibold text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-2">Add items to get started</p>
            </div>
          )}
        </div>

       <div className="absolute bottom-0 left-0 right-0 bg-white p-5">
          <h3 className="font-semibold text-gray-800">Items: {totalQty}</h3>
          <h3 className="font-semibold text-gray-800">
            Total Amount: ₹{totalPrice.toFixed(2)}
          </h3>
          <hr className="w-full my-2" />
                    <button
            onClick={handleCheckout}
            disabled={isProcessing || cartItems.length === 0}
            className={`font-bold px-3 text-white py-2 rounded-lg w-full mb-5 ${
              isProcessing || cartItems.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 active:bg-green-700"
            } transition-colors duration-200`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : cartItems.length === 0 ? (
              "Cart is Empty"
            ) : tableNumber !== "N/A" ? (
              `Add to Table ${tableNumber} Order`
            ) : (
              "Create New Order"
            )}
          </button>

        </div>
      </div>

      

      {showAddedBar && !activeCart && (
        <div className="fixed bottom-1 left-1/2   transform -translate-x-1/2 w-[95%] max-w-md bg-green-600 hover:bg-green-800 text-white px-6 py-4  rounded-xl shadow-2xl z-50 flex justify-between items-center animate-slide-up">
          <div className="flex items-center gap-3">
            <span className="bg-white text-green-600 rounded-full p-2">
              <FaShoppingCart className="text-lg" />
            </span>
            <div>
              <span className="font-semibold block">
                {totalQty} item{totalQty > 1 ? "s" : ""} added
              </span>
              <span className="text-sm opacity-90">Total: ₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveCart(true)}
            className="font-semibold bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
          >
            View Cart
          </button>
        </div>
      )}

      {activeCart && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setActiveCart(false)}
        />
      )}
    </>
  );
};

export default Cart;