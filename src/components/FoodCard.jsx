import React, { useState, useRef, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/CartSlice";

const FoodCard = ({
  id,
  name,
  price,
  desc,
  img,
  rating,
  handleToast,
  quantityPrices = [],
}) => {
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(price);
  const imgRef = useRef(null);
  const cardRef = useRef(null);

  const hasQuantityPrices = () => {
    return quantityPrices && quantityPrices.length > 0;
  };

  const isWeightBased = () => {
    const lowerName = name.toLowerCase().trim();
  };

  const getQuantityOptions = () => {
    if (hasQuantityPrices()) {
      return quantityPrices.map((qp) => ({
        quantity: qp.quantity,
        unit: qp.unit || "item",
        price: qp.price,
        display:
          qp.quantity +
          (qp.unit === "kg" ? " Kg" : qp.unit === "g" ? " Gm" : ""),
      }));
    }

    if (isWeightBased()) {
      return defaultWeightOptions;
    }

    return [
      { quantity: 1, unit: "item", price: price, display: "1 Item" },
      { quantity: 2, unit: "item", price: price * 2, display: "2 Items" },
      { quantity: 3, unit: "item", price: price * 3, display: "3 Items" },
      { quantity: 4, unit: "item", price: price * 4, display: "4 Items" },
      { quantity: 5, unit: "item", price: price * 5, display: "5 Items" },
    ];
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
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

  useEffect(() => {
    const options = getQuantityOptions();
    if (options.length > 0) {
      setSelectedQuantity(options[0].quantity);
      setSelectedPrice(options[0].price);
    }
  }, [quantityPrices]);

  const calculatePrice = (quantity) => {
    const options = getQuantityOptions();
    const option = options.find((opt) => opt.quantity === quantity);
    return option ? option.price : price;
  };

  const handleAddToCart = () => {
    if (hasQuantityPrices() || isWeightBased()) {
      setShowQuantityModal(true);
      return;
    }

    dispatch(
      addToCart({
        id,
        name,
        price,
        rating,
        img,
        qty: 1,
        quantity: 1,
        unit: "item",
        displayQuantity: "1 Item",
      })
    );
    handleToast(name);
  };

  const handleConfirmQuantity = () => {
    const selectedOption = getQuantityOptions().find(
      (opt) => opt.quantity === selectedQuantity
    );
    const finalPrice = calculatePrice(selectedQuantity);

    dispatch(
      addToCart({
        id,
        name,
        price: finalPrice,
        originalPrice: price,
        rating,
        img,
        qty: 1,
        quantity: selectedOption.quantity,
        unit: selectedOption.unit,
        displayQuantity: selectedOption.display,
      })
    );

    handleToast(`${name} - ${selectedOption.display}`);
    setShowQuantityModal(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const getButtonText = () => {
    if (hasQuantityPrices()) {
      return "Select Quantity";
    }
    if (isWeightBased()) {
      return "Select Weight";
    }
    return "Add to cart";
  };

  const getPriceDisplay = () => {
    if (hasQuantityPrices()) {
      const minPrice = Math.min(...quantityPrices.map((qp) => qp.price));
    }
    if (isWeightBased()) {
      return `₹${price}/100g`;
    }
    return `₹${price}`;
  };

  const quantityOptions = getQuantityOptions();

  return (
    <>
      <div
  ref={cardRef}
  className="font-bold w-full max-w-[180px] bg-white p-2 flex flex-col rounded-lg gap-2 shadow-md hover:shadow-lg transition-all duration-300 relative"
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
                🍽️
                <br />
                Image not available
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
                  ? "opacity-100 scale-100 blur-0"
                  : "opacity-0 scale-105 blur-sm"
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
            {getPriceDisplay()}
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
            {getButtonText()}
          </button>
        </div>

        {(hasQuantityPrices() || isWeightBased()) && (
          <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-1 rounded text-center">
            {hasQuantityPrices()
              ? "⚖️ Weight-based pricing"
              : "⚖️ Weight-based pricing"}
          </div>
        )}
      </div>

      {showQuantityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-center">
              Select {hasQuantityPrices() ? "Quantity" : "Weight"} for {name}
            </h3>

            <div className="space-y-3 mb-6">
              {quantityOptions.map((option) => (
                <div
                  key={option.quantity}
                  onClick={() => {
                    setSelectedQuantity(option.quantity);
                    setSelectedPrice(option.price);
                  }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedQuantity === option.quantity
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-3 ${
                          selectedQuantity === option.quantity
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                      />
                      <span className="font-semibold text-gray-800">
                        {option.display}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        ₹{option.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">
                  Selected {hasQuantityPrices() ? "quantity" : "weight"}:
                </span>
                <span className="font-semibold">
                  {
                    quantityOptions.find(
                      (opt) => opt.quantity === selectedQuantity
                    )?.display
                  }
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total price:</span>
                <span className="text-green-600">₹{selectedPrice}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowQuantityModal(false)}
                className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmQuantity}
                className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors"
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
