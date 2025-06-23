import React, { useEffect, useState } from "react";
import product from "../../movie.json";

const Movie = ({ category }) => {
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    const selectedCategory = product.categories.find(
      (cat) => cat.title.toLowerCase() === category.toLowerCase()
    );
    setCategoryData(selectedCategory);
  }, [category]);

  if (!categoryData) {
    return  ;
  }

  return (
    <div className="container mx-auto p-6 px-5 mt-16">
      <h2 className="text-xl font-semibold mb-4 flex justify-center">
        {categoryData.title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categoryData.images.map((image, index) => (
          <div
            key={index}
            className="p-4 rounded-xl shadow-2xl flex justify-center flex-col items-center bg-gray-100 "
          >
            <img
              src={image}
              alt={`Movie ${index + 1}`}
              className="h-96 object-cover rounded-md mb-4"
            />
            <p className="text-gray-600 mb-4 flex justify-center">
              {categoryData.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movie;
