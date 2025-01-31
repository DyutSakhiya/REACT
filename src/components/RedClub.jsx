import React, { useEffect, useState } from "react";
import product from "../../product.json"; 

const RedClub = ({ category }) => {
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    const selectedCategory = product.categories.find(
      (cat) => cat.title === category
    );
    setCategoryData(selectedCategory);
  }, [category]);

  if (!categoryData) {
    return <div>Loading...</div>;
  }

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default RedClub;
