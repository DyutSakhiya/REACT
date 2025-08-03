import React, { useEffect, useState } from "react";
import FoodData from "../data/FoodData";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../redux/slices/CategorySlice";

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const [showPunjabiSubmenu, setShowPunjabiSubmenu] = useState(false);
  const [showPunjabiSubmenu, setShowPunjabiSubmenu] = useState(false);

  const listUniqueCategories = () => {
    const uniqueCategories = [
      ...new Set(FoodData.map((food) => {
        if (food.category.includes("Punjabi")) {
          return "Punjabi";
        }
        return food.category;
      })),
    ];
    setCategories(uniqueCategories);
  };

  useEffect(() => {
    listUniqueCategories();
  }, []);

  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.category.category);

  const handleCategoryClick = (category) => {
    if (category === "Punjabi") {
      dispatch(setCategory("Punjabi Paneer"));
      setShowPunjabiSubmenu(true);
    } else {
      dispatch(setCategory(category));
      setShowPunjabiSubmenu(category.includes("Punjabi"));
    }
  };

  const isPunjabiSubcategory = selectedCategory.includes("Punjabi") && selectedCategory !== "Punjabi";

  return (
    <div className="ml-6">
      <h3 className="text-xl font-semibold">Find the best food</h3>
      <div className="my-5 flex gap-3 overflow-x-scroll scroll-smooth lg:overflow-x-hidden">
        <button
          onClick={() => handleCategoryClick("All")}
          className={`px-3 py-2 bg-gray-200 font-bold rounded-lg hover:bg-green-500 hover:text-white ${
            selectedCategory === "All" && "bg-green-500 text-white"
          }`}
        >
          All
        </button>
        {categories.map((category, index) => {
          const isActive = selectedCategory === category || (category === "Punjabi" && isPunjabiSubcategory);
          
          return (
            <button
              onClick={() => handleCategoryClick(category)}
              key={index}
              className={`px-3 py-2 bg-gray-200 font-bold rounded-lg hover:bg-green-500 hover:text-white ${
                isActive && "bg-green-500 text-white"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {(showPunjabiSubmenu || isPunjabiSubcategory) && (
        <div className="my-7 flex gap-3 overflow-x-scroll scroll-smooth lg:overflow-x-hidden">
          <button
            onClick={() => handleCategoryClick("Punjabi Paneer")}
            className={`px-3 py-2 bg-gray-200 font-bold rounded-lg hover:bg-green-400 hover:text-white ${
              selectedCategory === "Punjabi Paneer" && "bg-green-400 text-white"
            }`}
          >
            Paneer Dishes
          </button>
          <button
            onClick={() => handleCategoryClick("Punjabi Veg")}
            className={`px-3 py-2 bg-gray-200 font-bold rounded-lg hover:bg-green-400 hover:text-white ${
              selectedCategory === "Punjabi Veg" && "bg-green-400 text-white"
            }`}
          >
            Veg Dishes
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;