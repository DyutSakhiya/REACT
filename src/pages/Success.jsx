import React, { useState, useEffect } from "react";
import { PropagateLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { clearCart } from "../redux/slices/CartSlice";

const Success = () => {
  const [loading, setLoading] = useState(true);
  const cartItems = useSelector((state) => state.cart.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const orderId = location.state?.orderId;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleBackToMenu = () => {
    dispatch(clearCart());
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {loading ? (
        <div className="text-center">
          <PropagateLoader color="#36d7b7" />
          <p className="mt-4 text-gray-600">Processing your order...</p>
        </div>
      ) : (
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-3xl font-semibold mb-2">Order Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your order <strong>#{orderId}</strong> has been placed successfully.
          </p>
          <div className="mb-6 p-4 bg-gray-100 rounded">
            <p className="font-medium">Order Summary</p>
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
              <span>
                ₹
                {cartItems.reduce(
                  (total, item) => total + item.price * item.qty,
                  0
                )}
              </span>
            </div>
          </div>
          <button
            onClick={handleBackToMenu}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default Success;
