import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../redux/slices/CategorySlice";
import Axios from "axios";
import { useSearchParams } from "react-router-dom";

const API_URL = "https://backend-inky-gamma-67.vercel.app/api";

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const [showPunjabiSubmenu, setShowPunjabiSubmenu] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);

  const hotel_id = searchParams.get("hotel_id") || user?.hotelId || "hotel_001";
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.category.category);

  // ✅ Fetch categories safely
  const fetchCategories = async () => {
    try {
      const response = await Axios.get(`${API_URL}/get_categories?hotel_id=${hotel_id}`);
      if (response.data.success) {
        const processedCategories = processCategories(response.data.categories);
        setCategories(processedCategories);
      } else {
        setCategories(["All"]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories(["All"]); // fallback
    }
  };

  // ✅ Process categories to merge Punjabi subcategories
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

  const handleCategoryClick = (category) => {
    if (category === "Punjabi") {
      dispatch(setCategory("Punjabi Paneer"));
      setShowPunjabiSubmenu(true);
    } else {
      dispatch(setCategory(category));
      setShowPunjabiSubmenu(false);
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    dispatch(setCategory(subcategory));
  };

  const isPunjabiSubcategory =
    selectedCategory.includes("Punjabi") && selectedCategory !== "Punjabi";
  const isPunjabiMainSelected = selectedCategory === "Punjabi";

  return (
    <div className="ml-6">
      <h3 className="text-xl font-semibold">Find the best food</h3>

      {/* ✅ Fixed-size categories for mobile */}
      <div className="my-5 flex gap-3 overflow-x-auto scroll-smooth lg:overflow-x-hidden">
        {categories.map((category, index) => {
          const isActive =
            selectedCategory === category ||
            (category === "Punjabi" && isPunjabiSubcategory);

          return (
            <button
              onClick={() => handleCategoryClick(category)}
              key={index}
              className={`min-w-[100px] sm:min-w-[120px] text-sm text-center px-3 py-2 bg-gray-200 font-semibold rounded-lg flex-shrink-0 hover:bg-green-500 hover:text-white transition-all ${
                isActive && "bg-green-500 text-white"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* ✅ Punjabi Submenu */}
      {(showPunjabiSubmenu || isPunjabiMainSelected) && (
        <div className="my-7 flex gap-3 overflow-x-auto scroll-smooth lg:overflow-x-hidden">
          <button
            onClick={() => handleSubcategoryClick("Punjabi Paneer")}
            className={`min-w-[100px] sm:min-w-[120px] text-sm text-center px-3 py-2 bg-gray-200 font-semibold rounded-lg flex-shrink-0 hover:bg-green-400 hover:text-white transition-all ${
              selectedCategory === "Punjabi Paneer" && "bg-green-400 text-white"
            }`}
          >
            Paneer Dishes
          </button>
          <button
            onClick={() => handleSubcategoryClick("Punjabi Veg")}
            className={`min-w-[100px] sm:min-w-[120px] text-sm text-center px-3 py-2 bg-gray-200 font-semibold rounded-lg flex-shrink-0 hover:bg-green-400 hover:text-white transition-all ${
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
