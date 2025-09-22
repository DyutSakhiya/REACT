import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import ItemCard from "./ItemCard";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Axios from "axios";

const Cart = () => {
  const [activeCart, setActiveCart] = useState(false);
  const cartItems = useSelector((state) => state.cart.cart);
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const hotel_id = searchParams.get("hotel_id") || user?.hotel_id || "hotel_001";
  const totalQty = cartItems.reduce((totalQty, item) => totalQty + item.qty, 0);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const username = user?.username || "guest";

    try {
      const res = await Axios.get(
        `http://localhost:4000/api/orders/pending/${username}`
      );

      let orderId;
      if (res.data.success && res.data.order) {
        orderId = res.data.order.orderId;

        await Axios.put(
          `http://localhost:4000/api/orders/${res.data.order._id}/add-items`,
          {
            cartItems,
            total: totalPrice,
          }
        );
      } else {
        orderId = `ORD-${Date.now()}`;

        await Axios.post("http://localhost:4000/api/orders", {
          orderId,
          userId: username,
          hotelId: hotel_id,
          cartItems,
          total: totalPrice,
          timestamp: new Date(),
          status: "pending",
        });
      }

      navigate("/success", { state: { orderId } });
    } catch (err) {
      console.error("Failed to save order", err);
      alert("Something went wrong while placing your order.");
    }
  };

  return (
    <>
      <div
        className={`fixed right-0 top-0 w-full lg:w-[20vw] h-full p-5 bg-white mb-3 ${
          activeCart ? "translate-x-0" : "translate-x-full"
        } transition-all duration-500 z-50`}
      >
        <div className="flex justify-between items-center my-3">
          <span className="text-xl font-bold text-gray-800">My Order</span>
          <IoMdClose
            onClick={() => setActiveCart(!activeCart)}
            className="border-2 border-gray-600 text-gray-600 font-bold p-1 text-xl rounded-md hover:text-red-300 hover:border-red-300 cursor-pointer"
          />
        </div>

        <div className="h-[70vh] overflow-y-auto">
          {cartItems.length > 0 ? (
            cartItems.map((food) => (
              <ItemCard
                key={food.id}
                id={food.id}
                name={food.name}
                price={food.price}
                img={food.img}
                qty={food.qty}
              />
            ))
          ) : (
            <h2 className="text-center text-xl font-bold text-gray-800">
              Your cart is empty
            </h2>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white p-5">
          <h3 className="font-semibold text-gray-800">Items: {totalQty}</h3>
          <h3 className="font-semibold text-gray-800">
            Total Amount: ₹{totalPrice}
          </h3>
          <hr className="w-full my-2" />
          <button
            onClick={handleCheckout}
            className="bg-green-500 font-bold px-3 text-white py-2 rounded-lg w-full mb-5"
          >
            Checkout
          </button>
        </div>
      </div>

      <FaShoppingCart
        onClick={() => setActiveCart(!activeCart)}
        className={`rounded-full bg-white shadow-md text-5xl p-3 fixed bottom-4 right-4 ${
          totalQty > 0 && "animate-bounce delay-500 transition-all"
        }`}
      />
    </>
  );
};

export default Cart;