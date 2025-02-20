import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import product from "../../product.json";

const RedClub = ({ category }) => {
  const [categoryData, setCategoryData] = useState(null);
  const navigate = useNavigate();
=======
import product from "../../product.json"; 

const RedClub = ({ category }) => {
  const [categoryData, setCategoryData] = useState(null);
>>>>>>> 4db9f03 (Initial commit)

  useEffect(() => {
    const selectedCategory = product.categories.find(
      (cat) => cat.title === category
    );
    setCategoryData(selectedCategory);
  }, [category]);

  if (!categoryData) {
    return <div>Loading...</div>;
  }

<<<<<<< HEAD
  const handleViewClick = (index) => {
    navigate(`/product/${categoryData.title}/${index}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">{categoryData.title}</h2>
      <p className="text-gray-600 mb-4">{categoryData.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categoryData.images.map((image, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-lg flex justify-center flex-col items-center"
          >
            <img
              src={image}
              alt={`product ${index + 1}`}
              className="h-64 object-cover rounded-md mb-4"
            />
            <button
              onClick={() => handleViewClick(index)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            >
              View
            </button>
=======
  return (
    <div className="container mx-auto p-6 ">
      <h2 className="text-xl font-semibold mb-4">{categoryData.title}</h2>
      <p className="text-gray-600 mb-4">{categoryData.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4  ">
        {categoryData.images.map((image, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-lg flex justify-center">
            <img
              src={image} 
              alt={`Product ${index + 1}`}
              className=" h-64 object-cover rounded-md flex justify-center text-center"
            />
>>>>>>> 4db9f03 (Initial commit)
          </div>
        ))}
      </div>
    </div>
  );
};

export default RedClub;
