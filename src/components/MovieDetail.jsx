import React, { useState,useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import moviesData from "../../movie.json";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [category, setCategory] = useState("");

  useEffect(() => {

    for (const cat of moviesData.categories) {
      if (id < cat.images.length) {
        setMovie({
          image: cat.images[id],
          title: `${cat.title} Movie ${parseInt(id) + 1}`,
          category: cat.title
        });
        setCategory(cat.title);
        break;
      }
    }
  }, [id]);

  if (!movie) {
    return <div className="text-center py-10">Loading movie details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        
        <div className="md:w-2/3">
          <div className="mb-6">
            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
              {category}
            </span>
            <h1 className="text-3xl font-bold mt-2 text-gray-800">{movie.title}</h1>
            <div className="flex items-center mt-4 space-x-4">
              <span className="flex items-center text-yellow-500">
                ★★★★☆
                <span className="ml-2 text-gray-600">(4.0)</span>
              </span>
              <span className="text-gray-600">2023</span>
              <span className="text-gray-600">2h 15m</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Overview</h2>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Cast</h2>
            <div className="flex flex-wrap gap-4">
              {['Actor 1', 'Actor 2', 'Actress 1', 'Actress 2'].map((actor, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-2"></div>
                  <span className="text-sm text-gray-700">{actor}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-full transition duration-300">
              Watch Now
            </button>
            <button className="border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold py-2 px-6 rounded-full transition duration-300">
              Add to List
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">More from {category}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {moviesData.categories
            .find(cat => cat.title === category)
            ?.images.filter((_, i) => i !== parseInt(id))
            .slice(0, 5)
            .map((image, index) => (
              <Link 
                to={`/movie/${index}`} 
                key={index}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300">
                  <img
                    src={image}
                    alt={`${category} Movie ${index + 1}`}
                    className="h-96 object-cover rounded-md mb-4"
                  />
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;