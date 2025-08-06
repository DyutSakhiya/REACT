import React, { useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Axios from "axios";

const FoodItems = () => {
  const category = useSelector((state) => state.category.category);
  const search = useSelector((state) => state.search.search);
  const handleToast = (name) => toast.success(`Added ${name}`);

  const [list, setList] = useState([]);

  useEffect(() => {
    Axios.get(`http://localhost:4000/api/get_food_items?category=${category}&search=${search}`)
      .then((res) => setList(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, [category , search]);



 return (
  <>
    <Toaster position="top-center" reverseOrder={false} />
    <div className="mx-6 my-10">
    
        <div className="flex flex-wrap gap-10 justify-center lg:justify-start">
          {list.map((food) => (
            <FoodCard
              key={food._id || food.id}
              id={food._id || food.id}
              name={food.name || "Unnamed"}
              price={food.price || "0"}
              desc={food.desc || "No description available."}
              rating={food.rating || 0}
              img={food.img || ""}
              handleToast={handleToast}
            />
          ))}
        </div>
    
    </div>
  </>
);

};

export default FoodItems;
