import React from "react";
import { AiFillStar } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/CartSlice";

const FoodCard = ({ id, name, price, desc, img, rating, handleToast }) => {
  const dispatch = useDispatch();

  return (
    <div className="font-bold w-[150px] sm:w-[180px] md:w-[200px] bg-white p-4 flex flex-col rounded-lg gap-2 shadow-md hover:shadow-lg transition-all duration-300">
      {/* ✅ Fixed image size */}
      <img
        src={img}
        alt={name}
        className="w-full h-40 object-cover rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
      />

      <div className="text-sm flex justify-between items-center mt-2">
        <h2 className="truncate">{name}</h2>
        <span className="text-green-500 font-semibold">₹{price}</span>
      </div>

      <p className="text-xs text-gray-600 font-normal line-clamp-2">{desc}</p>

      <div className="flex justify-between items-center mt-1">
        <span className="flex items-center text-sm">
          <AiFillStar className="mr-1 text-yellow-400" /> {rating}
        </span>
        <button
          onClick={() => {
            dispatch(addToCart({ id, name, price, rating, img, qty: 1 }));
            handleToast(name);
          }}
          className="px-2 py-1 text-white bg-green-500 hover:bg-green-600 rounded-md text-xs"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
