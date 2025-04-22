import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import product from "../../product.json";

const ProductDetail = () => {
  const { id, index } = useParams();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const categoryData = product.categories.find((cat) => cat.title === id);
    if (categoryData) {
      setSelectedProduct(categoryData);
      setMainImage(categoryData.images[index] || categoryData.images[0]);
    }
  }, [id, index]);

  const addToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const newItem = {
      id: selectedProduct.title,
      image: mainImage,
      description: selectedProduct.description,
    };
    
    cartItems.push(newItem);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    setCart(cartItems);
    alert("Item added to cart!");
  };

  if (!selectedProduct) {
    return (
      <div className="h-screen flex justify-center items-center text-red-500">
        Product not found.
      </div>
    );
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
              src={`../../public/${mainImage}`}
              alt={selectedProduct.title}
              className="w-full h-96 object-contain"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-4">{selectedProduct.title}</h2>
            <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
            <div className="flex space-x-4">
              <button 
                onClick={addToCart}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              >
                Add to Cart
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
            {selectedProduct.images.map((image, idx) => (
              <img
                key={idx}
                src={`../../public/${image}`}
                alt={`../../public/${selectedProduct.title} ${idx + 1}`}
                className={`w-20 h-24 object-cover rounded-md cursor-pointer ${
                  mainImage === image ? "border-3 " : ""
                }`}
                onClick={() => setMainImage(image)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
