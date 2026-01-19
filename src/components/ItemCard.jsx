import React from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  incrementQty,
  decrementQty,
} from "../redux/slices/cartSlice";
import { toast } from "react-hot-toast";

const ItemCard = ({ id, name, qty, price, img }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex gap-2 shadow-md rounded-lg p-2 mb-3 relative">
      <MdDelete
        onClick={() => {
          dispatch(removeFromCart({ id, img, name, price, qty }));
          toast(`${name} Removed!`, {
            icon: "👋",
          });
        }}
        className="absolute right-2 top-2 text-gray-600 cursor-pointer hover:text-red-500"
      />

      <img src={img} alt={name} className="w-[50px] h-[50px] object-cover" />

      <div className="flex flex-col flex-grow">
        <h2 className="font-bold text-gray-800">{name}</h2>
        <div className="flex justify-between items-center mt-1">
          <span className="text-green-500 font-bold">₹{price}</span>

          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
            <AiOutlineMinus
              onClick={() => {
                if (qty > 1) {
                  dispatch(decrementQty({ id }));
                } else {
                  dispatch(removeFromCart({ id, img, name, price, qty }));  
                  toast(`${name} Removed!`, { icon: "👋" });
                }
              }}
              className="border-2 border-gray-600 text-gray-600 hover:text-white hover:bg-green-500 hover:border-none rounded-md p-1 text-xl transition-all ease-linear cursor-pointer"
            />

            <span className="font-medium w-6 text-center">{qty}</span>

            <AiOutlinePlus
              onClick={() => dispatch(incrementQty({ id }))}
              className="border-2 border-gray-600 text-gray-600 hover:text-white hover:bg-green-500 hover:border-none rounded-md p-1 text-xl transition-all ease-linear cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;