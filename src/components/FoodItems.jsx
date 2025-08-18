import React, { useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Axios from "axios";

const FoodItems = () => {
  const category = useSelector((state) => state.category.category);
  const search = useSelector((state) => state.search.search);
  const { user } = useSelector((state) => state.auth);
  const handleToast = (name) => toast.success(`Added ${name}`);

  const [list, setList] = useState([]);

  useEffect(() => {
    // Get hotel_id from user data or use default
    const hotel_id = user?.hotel_id || "hotel_001";
    
    Axios.get(`http://localhost:4000/api/get_food_items?category=${category}&search=${search}&hotel_id=${hotel_id}`)
      .then((res) => setList(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, [category, search, user?.hotel_id]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="mx-6 my-10">
        {Object.entries(
          list.reduce((acc, item) => {
            const category = item.category || "Uncategorized";
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
          }, {})
        ).map(([categoryName, items]) => (
          <div key={categoryName} className="mb-12">
            <h2 className="text-2xl font-bold mb-4 capitalize">{categoryName}</h2>

            <div className="flex flex-wrap gap-10 justify-center lg:justify-start">
              {items.map((food) => (
                <FoodCard
                  key={food._id || food.id}
                  id={food._id || food.id}
                  name={food.name || "Unnamed"}
                  price={food.price || "0"}
                  desc={food.desc || "No description available."}
                  rating={food.rating || 0}
                  img={food.imageUrl || ""}
                  handleToast={handleToast}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FoodItems;