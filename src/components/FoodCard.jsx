import React, { useState, useRef, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/CartSlice";

const FoodCard = ({ id, name, price, desc, img, rating, handleToast }) => {
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantity, setQuantity] = useState(250); 
  const [unit, setUnit] = useState("g"); 
  const imgRef = useRef(null);
  const cardRef = useRef(null);

  const weightBasedItems = [
    "vanela gathiya.","fafda gathiya","jalebi","chieps","sev khamani","khaman dhokl","kaju butter masala","kaju curry","kaju paneer butter masala","kaju paneer kofta","matar paneer","palak-paneer","paneer angara","paneer butter masala","paneer capsicum","paneer cheese butter masala","paneer handi","paneer kadai","paneer kofta","paneer makhani","paneer pasanda","paneer patiala","paneer shahi korma","paneer tawa","paneer tika","paneer tufani","paneer-bhurji","punjabi shahi paneer","mix veg","allu mutter","veg makhanwala","veg kolhapuri","veg jaipuri","veg hariyali","veg angara","veg toofani","veg kofta","veg kadai","veg handi","veg patiala","dal makhani","veg makhanwala (vegetable makhani)","veg. kadai"

  ];

  const isWeightBased = weightBasedItems.includes(name.toLowerCase());

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const calculatePrice = () => {
    if (!isWeightBased) return price;
    
    let weightInGrams = quantity;
    if (unit === "kg") {
      weightInGrams = quantity * 1000;
    }
    
    const pricePer100g = price;
    return (weightInGrams / 100) * pricePer100g;
  };

  const handleAddToCart = () => {
    if (isWeightBased) {
      setShowQuantityModal(true);
      return;
    }
    
    dispatch(addToCart({ 
      id, 
      name, 
      price, 
      rating, 
      img, 
      qty: 1,
      weight: null,
      unit: null
    }));
    handleToast(name);
  };

  const handleConfirmWeight = () => {
    const finalPrice = calculatePrice();
    const weightInfo = isWeightBased ? {
      weight: quantity,
      unit: unit
    } : {};

    dispatch(addToCart({ 
      id, 
      name, 
      price: finalPrice,
      originalPrice: price,
      rating, 
      img, 
      qty: 1,
      ...weightInfo
    }));
    
    handleToast(`${name} - ${quantity}${unit}`);
    setShowQuantityModal(false);
    setQuantity(250);
    setUnit("g");
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const incrementQuantity = () => {
    if (unit === "g") {
      setQuantity(prev => Math.min(prev + 50, 5000)); 
    } else {
      setQuantity(prev => Math.min(prev + 0.5, 10)); 
    }
  };

  const decrementQuantity = () => {
    if (unit === "g") {
      setQuantity(prev => Math.max(prev - 50, 50));
    } else {
      setQuantity(prev => Math.max(prev - 0.5, 0.5)); 
    }
  };

  const toggleUnit = () => {
    if (unit === "g") {
      setQuantity(parseFloat((quantity / 1000).toFixed(2)));
      setUnit("kg");
    } else {
      setQuantity(Math.round(quantity * 1000));
      setUnit("g");
    }
  };

  return (
    <>
      <div 
        ref={cardRef}
        className="font-bold w-[200px] sm:w-[180px] md:w-[200px] bg-white p-4 flex flex-col rounded-lg gap-2 shadow-md hover:shadow-lg transition-all duration-300 relative"
      >
        
        <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
         
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
              <div className="text-gray-400 text-xs text-center p-2">
                🍽️<br/>Image not available
              </div>
            </div>
          )}
          
          
          {isInView && (
            <img
              ref={imgRef}
              src={img}
              alt={name}
              loading="lazy"
              className={`w-full h-40 object-cover rounded-lg transition-all duration-500 ${
                imageLoaded 
                  ? 'opacity-100 scale-100 blur-0' 
                  : 'opacity-0 scale-105 blur-sm'
              } hover:scale-110 cursor-pointer`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
         
          {!imageLoaded && isInView && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-lg"></div>
          )}
        </div>

        
        <div className="text-sm flex justify-between items-center mt-2">
          <h2 className="truncate">{name}</h2>
          <span className="text-green-500 font-semibold">
            {isWeightBased ? `₹${price}/100g` : `₹${price}`}
          </span>
        </div>

        <p className="text-xs text-gray-600 font-normal line-clamp-2">{desc}</p>

        <div className="flex justify-between items-center mt-1">
          <span className="flex items-center text-sm">
            <AiFillStar className="mr-1 text-yellow-400" /> {rating}
          </span>
          <button
            onClick={handleAddToCart}
            className="px-2 py-1 text-white bg-green-500 hover:bg-green-600 rounded-md text-xs transition-colors duration-200"
          >
            {isWeightBased ? "Select Quantity" : "Add to cart"}
          </button>
        </div>

        {isWeightBased && (
          <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-1 rounded text-center">
            ⚖️ Weight-based pricing
          </div>
        )}
      </div>

      {showQuantityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Select Quantity for {name}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-300"
                >
                  -
                </button>
                
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {quantity} {unit}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Total: ₹{calculatePrice().toFixed(2)}
                  </div>
                </div>
                
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              <button
                onClick={toggleUnit}
                className="w-full py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
              >
                Switch to {unit === "g" ? "Kilograms" : "Grams"}
              </button>
            </div>

            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <div className="flex justify-between text-sm">
                <span>Price per 100g:</span>
                <span>₹{price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Selected quantity:</span>
                <span>{quantity} {unit}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-1 mt-1">
                <span>Total price:</span>
                <span>₹{calculatePrice().toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowQuantityModal(false)}
                className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWeight}
                className="flex-1 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodCard;