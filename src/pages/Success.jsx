import React, { useState, useEffect } from "react";
import { PropagateLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { clearCart } from "../redux/slices/CartSlice";

const API_URL = "https://backend-inky-gamma-67.vercel.app/api";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleBackToMenu = () => {
    dispatch(clearCart());
    navigate(`/?hotel_id=${hotelId}`);
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

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
            Your order <strong>#{orderId}</strong> has been placed successfully.
            {merged && (
              <span className="block text-sm text-blue-600 mt-1">
                Items have been added to your existing order.
              </span>
            )}
          </p>

          <div className="mb-6 p-4 bg-gray-100 rounded">
            <p className="font-medium">Order Summary</p>
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between mt-2">
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
                <div className="flex justify-between mt-4 pt-2 border-t border-gray-300 font-bold">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm mt-2">
                {merged
                  ? "(Items were merged into your pending order)"
                  : "(No items in current cart)"}
              </p>
            )}
          </div>

          <button
            onClick={handleBackToMenu}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 w-full"
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default Success;
