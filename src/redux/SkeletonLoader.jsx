import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="px-4 sm:px-6 md:px-10 py-6">
      {Array.from({ length: 3 }).map((_, categoryIndex) => (
        <div key={categoryIndex} className="mb-10">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-5 animate-pulse"></div>
          
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 justify-items-center">
            {Array.from({ length: 5 }).map((_, cardIndex) => (
              <div key={cardIndex} className="w-full sm:w-auto flex justify-center animate-pulse">
                <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-[200px]">
                  <div className="w-full h-32 bg-gray-300 rounded-t-lg"></div>
                  
                  <div className="p-3">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                    
                    <div className="h-3 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mb-3"></div>
                    
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;