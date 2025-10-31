import React, { useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Axios from "axios";
import { useSearchParams } from "react-router-dom";

const API_URL = "https://backend-inky-gamma-67.vercel.app/api";

const FoodItems = () => {
  const category = useSelector((state) => state.category.category);
  const search = useSelector((state) => state.search.search);
  const [searchParams] = useSearchParams();
  const hotel_id = searchParams.get("hotel_id") || "hotel_001";

  const handleToast = (name) => toast.success(`Added ${name}`);

  const [list, setList] = useState([]);

  useEffect(() => {
    Axios.get(
      `${API_URL}/get_food_items?category=${category}&search=${search}&hotel_id=${hotel_id}`
    )
      .then((res) => setList(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, [category, search, hotel_id]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="px-4 sm:px-6 md:px-10 py-6">
        {Object.entries(
          list.reduce((acc, item) => {
            const cat = item.category || "Uncategorized";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
          }, {})
        ).map(([categoryName, items]) => (
          <div key={categoryName} className="mb-10">
            <h2 className="text-lg sm:text-2xl font-bold mb-5 capitalize  sm:text-left">
              {categoryName}
            </h2>

            <div className=" grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 justify-items-center">
              {items.map((food) => (
                <div className="w-full sm:w-auto flex justify-center" key={food._id || food.id}>
                  <FoodCard
                    id={food._id || food.id}
                    name={food.name || "Unnamed"}
                    price={food.price || "0"}
                    desc={food.desc || "No description available."}
                    rating={food.rating || 0}
                    img={food.imageUrl || ""}
                    handleToast={handleToast}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FoodItems;
