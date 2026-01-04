import React, { useEffect, useState, useRef, useCallback } from "react";
import FoodCard from "./FoodCard";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Axios from "axios";
import { useSearchParams } from "react-router-dom";

const API_URL = "https://backend-inky-gamma-67.vercel.app/api";
// const API_URL = "http://localhost:4000/api";

const FoodCardSkeleton = () => {
  return (
    <div className="w-full flex justify-center animate-pulse">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full h-full">
        <div className="w-full h-48 bg-gray-300 rounded-t-2xl"></div>
        
        <div className="p-4">
          <div className="h-5 bg-gray-300 rounded mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-300 rounded w-16"></div>
            <div className="h-10 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategorySkeleton = () => {
  return (
    <div className="mb-10 animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-48 mb-5"></div>
      
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="w-full">
            <FoodCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

const FoodItems = () => {
  const category = useSelector((state) => state.category.category);
  const search = useSelector((state) => state.search.search);
  const [searchParams] = useSearchParams();
  const currentHotel = searchParams.get("hotel_id") || "hotel_001";
  const tableNum = searchParams.get("table_id");

  const [tableNumber, setTableNumber] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const observer = useRef();

  const handleToast = (name) => toast.success(`Added ${name}`);

  const preloadImages = useCallback((items) => {
    items.forEach(item => {
      if (item.imageUrl && !loadedImages[item.imageUrl]) {
        const img = new Image();
        img.src = item.imageUrl;
        img.onload = () => {
          setLoadedImages(prev => ({ ...prev, [item.imageUrl]: true }));
        };
      }
    });
  }, [loadedImages]);

  const [cache, setCache] = useState({});
  const getCacheKey = useCallback((cat, searchTerm, hotelId, pageNum) => {
    return `${cat}_${searchTerm}_${hotelId}_${pageNum}`;
  }, []);

  const fetchFoodItems = useCallback(async (pageNum = 1, append = false) => {
    try {
      const cacheKey = getCacheKey(category, search, currentHotel, pageNum);
      
      if (cache[cacheKey] && pageNum === 1) {
        setList(cache[cacheKey]);
        setInitialLoad(false);
        setLoading(false);
        preloadImages(cache[cacheKey]);
        return;
      }

      if (pageNum === 1) {
        setLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      const response = await Axios.get(
        `${API_URL}/get_food_items?category=${category}&search=${search}&hotel_id=${currentHotel}&page=${pageNum}`,
        {
          timeout: 10000, 
          headers: {
            'Cache-Control': 'max-age=300' 
          }
        }
      );

      const newData = response.data;
      
      preloadImages(newData);
      
      if (append) {
        setList(prev => {
          const combined = [...prev, ...newData];
          if (pageNum === 1) {
            setCache(prevCache => ({
              ...prevCache,
              [cacheKey]: combined
            }));
          }
          return combined;
        });
      } else {
        setList(newData);
        if (pageNum === 1) {
          setCache(prevCache => ({
            ...prevCache,
            [cacheKey]: newData
          }));
        }
      }

      setHasMore(newData.length >= 20);
      
      if (pageNum === 1) {
        setInitialLoad(false);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.code === 'ECONNABORTED') {
        toast.error("Network timeout. Please check your connection.");
      } else {
        toast.error("Failed to load food items");
      }
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, [category, search, currentHotel, preloadImages, cache, getCacheKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setInitialLoad(true);
      setList([]); 
      fetchFoodItems(1, false);
    }, 300); 

    return () => clearTimeout(timer);
  }, [category, search, currentHotel]);

  const lastFoodElementRef = useCallback(node => {
    if (loading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchFoodItems(nextPage, true);
      }
    }, {
      threshold: 0.1, 
      rootMargin: '200px' 
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, page, fetchFoodItems, isFetchingMore]);

  const groupedItems = list.reduce((acc, item) => {
    const cat = item.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = Object.entries(groupedItems);

  const renderFoodItems = (items, isLastCategory) => {
    return items.map((food, index) => {
      const isLastItem = isLastCategory && index === items.length - 1;
      
      return (
        <div
          ref={isLastItem ? lastFoodElementRef : null}
          className="w-full flex justify-center"
          key={food._id || food.id}
        >
          <FoodCard
            id={food._id || food.id}
            name={food.name || "Unnamed"}
            price={food.price || "0"}
            desc={food.desc || "No description available."}
            rating={food.rating || 0}
            img={food.imageUrl || ""}
            handleToast={handleToast}
            quantityPrices={food.quantityPrices || []}
            imageLoaded={loadedImages[food.imageUrl]}
            containerClass="h-full"
            imageClass="h-48 object-cover"
          />
        </div>
      );
    });
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="px-4 sm:px-6 md:px-10 py-6">
        {initialLoad && (
          <>
            <CategorySkeleton />
            <CategorySkeleton />
          </>
        )}

        {!initialLoad && categories.map(([categoryName, items], categoryIndex) => (
          <div key={categoryName} className="mb-10">
            <h2 className="text-lg sm:text-2xl font-bold mb-5 capitalize sm:text-left">
              {categoryName} 
            </h2>

            {/* Fixed grid with consistent spacing */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 lg:gap-8">
              {renderFoodItems(items, categoryIndex === categories.length - 1)}
            </div>
          </div>
        ))}

        {(isFetchingMore || (loading && !initialLoad)) && (
          <div className="mt-8">
            <div className="text-center mb-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-500 mt-2">Loading more delicious items...</p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 lg:gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`loading-more-${index}`} className="w-full">
                  <FoodCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasMore && list.length > 0 && !isFetchingMore && (
          <div className="text-center py-8 border-t mt-8">
            <p className="text-gray-500 text-lg">🎉 You've seen all the delicious food!</p>
          </div>
        )}

        {!initialLoad && list.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🍕</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No food items found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </>
  );
};

export default FoodItems;