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

  const fetchCategories = async () => {
    try {
      const response = await Axios.get(
        `${API_URL}/categories/${hotel_id}`
      );
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
    <div className="ml-5">
      <h3 className="text-xl font-semibold">Find the best food</h3>
      <div className="my-5 flex gap-3 overflow-x-auto scroll-smooth no-scrollbar">
  {categories.map((category, index) => {
    const isActive =
      selectedCategory === category ||
      (category === "Punjabi" && isPunjabiSubcategory);

    return (
      <button
        onClick={() => handleCategoryClick(category)}
        key={index}
        className={`px-3 py-2 bg-gray-200 font-bold rounded-lg hover:bg-green-500 hover:text-white whitespace-nowrap ${
          isActive && "bg-green-500 text-white"
        }`}
      >
        {category}
      </button>
    );
  })}
</div>

{(showPunjabiSubmenu || isPunjabiMainSelected) && (
  <div className="my-7 flex gap-3 overflow-x-auto scroll-smooth no-scrollbar">
    <button
      onClick={() => handleSubcategoryClick("Punjabi Paneer")}
      className={`px-3 py-2 bg-gray-200 font-bold rounded-lg hover:bg-green-400 hover:text-white whitespace-nowrap ${
        selectedCategory === "Punjabi Paneer" && "bg-green-400 text-white"
      }`}
    >
      Paneer Dishes
    </button>
    <button
      onClick={() => handleSubcategoryClick("Punjabi Veg")}
      className={`px-3 py-2 bg-gray-200 font-bold rounded-lg hover:bg-green-400 hover:text-white whitespace-nowrap ${
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
