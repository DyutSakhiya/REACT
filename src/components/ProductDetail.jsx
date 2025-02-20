import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import product from "../../product.json";

const ProductDetail = () => {
  const { id, index } = useParams();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const categoryData = product.categories.find((cat) => cat.title === id);
    if (categoryData) {
      setSelectedProduct({
        title: categoryData.title,
        description: categoryData.description,
        images: categoryData.images,
        image: categoryData.images[index],
      });
    }
  }, [id, index]);

  if (!selectedProduct) {
    return <div className="h-screen flex justify-center items-center text-red-500">Product not found.</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-4xl w-full relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-700"
        >
          X
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center items-center">
            <img
              src={`../../public/${selectedProduct.image}`}
              alt={selectedProduct.title}
              className="w-full h-96 object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-4">{selectedProduct.title}</h2>
            <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
            <div className="flex space-x-4">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
                Add
              </button>
              <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700">
                Shop Now
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">More Images</h3>
          <div className="grid grid-cols-3 gap-4">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={`../../public/${image}`}
                alt={`${selectedProduct.title} ${index + 1}`}
                className="w-15 h-24 object-cover rounded-md cursor-pointer flex ml-16"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
