import React from "react";
import FoodCard from "./FoodCard";
import FoodData from "../data/FoodData.json";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const FoodItems = () => {
  const category = useSelector((state) => state.category.category);
  const search = useSelector((state) => state.search.search);
  const handleToast = (name) => toast.success(`Added ${name}`);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      
      {category === "All" ? (
        [...new Set(FoodData.map(item => item.category))].map((cat) => {
          const filteredItems = FoodData.filter(
            (food) =>
              food.category === cat &&
              food.name.toLowerCase().includes(search.toLowerCase())
          );
          return (
            filteredItems.length > 0 && (
              <div key={cat} className="mx-6 my-10">
                <h2 className="text-2xl font-bold mb-4">{cat}</h2>
                <div className="flex flex-wrap gap-10 justify-center lg:justify-start">
                  {filteredItems.map((food) => (
                    <FoodCard
                      key={food.id}
                      id={food.id}
                      name={food.name}
                      price={food.price}
                      desc={food.desc}
                      rating={food.rating}
                      img={food.img}
                      handleToast={handleToast}
                    />
                  ))}
                </div>
              </div>
            )
          );
        })
      ) : (
        <div className="mx-6 my-10">
          <div className="flex flex-wrap gap-10 justify-center lg:justify-start">
            {FoodData.filter(
              (food) =>
                food.category === category &&
                food.name.toLowerCase().includes(search.toLowerCase())
            ).map((food) => (
              <FoodCard
                key={food.id}
                id={food.id}
                name={food.name}
                price={food.price}
                desc={food.desc}
                rating={food.rating}
                img={food.img}
                handleToast={handleToast}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FoodItems;