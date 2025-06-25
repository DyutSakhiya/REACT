import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moviesData from "../../movie.json";

const Movie = ({ category }) => {
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    const selectedCategory = moviesData.categories.find(
      (cat) => cat.title.toLowerCase() === category.toLowerCase()
    );
    setCategoryData(selectedCategory);
  }, [category]);

  if (!categoryData) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        {categoryData.title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoryData.images.map((image, index) => (
          <Link
            to={`/movie/${categoryData.title
              .toLowerCase()
              .replace(" ", "-")}/${index}`}
            key={index}
            className="group"
          >
            {" "}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative overflow-hidden  flex justify-center items-center my-5">
                <img
                  src={image}
                  alt={`${categoryData.title} ${index + 1}`}
                  className="h-96 object-cover rounded-md mb-4  transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold">
                    View Details
                  </button>
                </div>
              </div>
              <div className="p-4 flex justify-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {categoryData.description}{" "}
                </h3>
                <p className="text-gray-600">
                  {categoryData.description || "Popular movie in this category"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Movie;
