import React, { useState, useEffect } from "react";
import { PropagateLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { clearCart } from "../redux/slices/CartSlice";

const API_URL = "https://backend-inky-gamma-67.vercel.app/api";
// const API_URL  = "http://localhost:4000/api"

const Success = () => {
  const [loading, setLoading] = useState(true);
  const cartItems = useSelector((state) => state.cart.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const orderId = location.state?.orderId;
  const hotelId = location.state?.hotelId || user?.hotelId || "hotel_001";
  const merged = location.state?.merged || false;
  const tableNumber = location.state?.tableNumber || "N/A";

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleBackToMenu = () => {
    dispatch(clearCart());
    navigate(`/?hotel_id=${hotelId}${tableNumber !== "N/A" ? `&table_id=${tableNumber}` : ""}`);
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const getItemDisplay = (item) => {
    if (item.weight && item.unit) {
      return `${item.name} - ${item.weight}${item.unit}`;
    }
    return item.name;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {loading ? (
        <div className="text-center">
          <PropagateLoader color="#36d7b7" />
          <p className="mt-4 text-gray-600">Processing your order...</p>
        </div>
      ) : (
        <div className="text-center max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-3xl font-semibold mb-2">Order Successful!</h2>
          <p className="text-gray-600 mb-6">
            {merged ? (
              <>
                Items have been added to your existing order for <strong>Table {tableNumber}</strong>.
              </>
            ) : (
              <>
                Your new order <strong>#{orderId}</strong> has been created for <strong>Table {tableNumber}</strong>.
              </>
            )}
          </p>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg">🍽️</span>
              <span className="text-lg font-semibold text-blue-700">
                Table: {tableNumber}
              </span>
            </div>
            <p className="text-sm text-blue-600">
              {merged 
                ? "Next orders from this table will be merged"
                : "Remember this table number for future orders"
              }
            </p>
          </div>

          <div className="mb-6 p-4 bg-gray-100 rounded">
            <p className="font-medium">Order Summary</p>
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between mt-2 text-sm">
                    <span className="text-left flex-1">
                      {getItemDisplay(item)} × {item.quantity === 1 ? (item.qty) : item.qty + ' x ' + item.quantity}
                    </span>
                    <span className="text-right flex-1">₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between mt-4 pt-2 border-t border-gray-300 font-bold">
                  <span>Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm mt-2">
                {(merged
                  ? "(Items were merged into your pending order)"
                  : "(No items in current cart)")}
              </p>
            )}
          </div>

          <button
            onClick={handleBackToMenu}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 w-full"
          >
            {tableNumber !== "N/A" 
              ? `Continue Ordering for Table ${tableNumber}`
              : "Back to Menu"
            }
          </button>
        </div>
      )}
    </div>
  );
};

export default Success;