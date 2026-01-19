import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../redux/slices/categorySlice";
import Axios from "axios";
import { useSearchParams } from "react-router-dom";

import { API_URL } from "../helper";

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const [showPunjabiSubmenu, setShowPunjabiSubmenu] = useState(false);
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const hotel_id = searchParams.get("hotel_id") || user?.hotelId || "hotel_001";

  const fetchCategories = async () => {
    try {
      const response = await Axios.get(`${API_URL}/categories/${hotel_id}`);
      if (response.data.success) {
        const processedCategories = processCategories(response.data.categories);
        setCategories(processedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories(["All"]);
    }
  };

  const processCategories = (categories) => {
    const uniqueCategories = ["All"];
    const hasPunjabi = categories.some((cat) => cat.includes("Punjabi"));

    categories.forEach((category) => {
      if (category.includes("Punjabi")) {
        if (!uniqueCategories.includes("Punjabi")) {
          uniqueCategories.push("Punjabi");
        }
      } else if (category && !uniqueCategories.includes(category)) {
        uniqueCategories.push(category);
      }
    });

    return uniqueCategories;
  };

  useEffect(() => {
    fetchCategories();
  }, [hotel_id]);

  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.category.category);

  const handleCategoryClick = async (category) => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 100));

    if (category === "Punjabi") {
      dispatch(setCategory("Punjabi Paneer"));
      setShowPunjabiSubmenu(true);
    } else {
      dispatch(setCategory(category));
      setShowPunjabiSubmenu(false);
    }

    setIsLoading(false);
  };

  const handleSubcategoryClick = async (subcategory) => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 100));

    dispatch(setCategory(subcategory));
    setIsLoading(false);
  };

  const isPunjabiSubcategory =
    selectedCategory.includes("Punjabi") && selectedCategory !== "Punjabi";
  const isPunjabiMainSelected = selectedCategory === "Punjabi";

  return (
    <>
      <div className="fixed top-21 left-0 right-0 bg-white z-40 pt-4 pb-2 shadow-md ">
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-1 bg-green-500 z-50">
            <div className="h-full bg-green-600 animate-pulse"></div>
          </div>
        )}

        <div className="px-4  sm:px-6   lg:px-8">
          <h3 className="text-lg sm:text-xl my-5      sm:my-3 font-semibold">
            Find the best food
          </h3>
          <div className="my-2  sm:my-3 flex gap-2 sm:gap-3 overflow-x-auto scroll-smooth no-scrollbar pt-2 ">
            {categories.map((category, index) => {
              const isActive =
                selectedCategory === category ||
                (category === "Punjabi" && isPunjabiSubcategory);

              return (
                <button
                  onClick={() => handleCategoryClick(category)}
                  key={index}
                  disabled={isLoading}
                  className={`px-3 py-2 text-sm sm:text-base bg-gray-200 font-bold rounded-lg hover:bg-green-500 hover:text-white whitespace-nowrap transition-all duration-200 ${isActive && "bg-green-500 text-white"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {(showPunjabiSubmenu || isPunjabiMainSelected) && (
            <div className="my-2 sm:my-3 flex gap-2 sm:gap-3 overflow-x-auto scroll-smooth no-scrollbar">
              <button
                onClick={() => handleSubcategoryClick("Punjabi Paneer")}
                disabled={isLoading}
                className={`px-3 py-2 text-sm sm:text-base bg-gray-200 font-bold rounded-lg hover:bg-green-400 hover:text-white whitespace-nowrap transition-all duration-200 ${selectedCategory === "Punjabi Paneer" &&
                  "bg-green-400 text-white"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Paneer Dishes
              </button>
              <button
                onClick={() => handleSubcategoryClick("Punjabi Veg")}
                disabled={isLoading}
                className={`px-3 py-2 text-sm sm:text-base bg-gray-200 font-bold rounded-lg hover:bg-green-400 hover:text-white whitespace-nowrap transition-all duration-200 ${selectedCategory === "Punjabi Veg" &&
                  "bg-green-500 text-white"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Veg Dishes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-36 sm:h-36 lg:h-30"></div>
    </>
  );
};

export default CategoryMenu;
