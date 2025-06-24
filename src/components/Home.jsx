import React from "react";
import { Link } from "react-router-dom";
import moviesData from "../../movie.json";

const Home = () => {
  const featuredCategories = moviesData.categories.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16">
        <div className="relative h-96 rounded-xl overflow-hidden w-full max-w-screen-xl mx-auto">
          <img
            src="/public/Mission.jpg"
            alt="Featured Movie"
            className="h-[648px] w-[1276px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end p-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Featured Movie
              </h1>
              <p className="text-gray-300 mb-4">Now streaming on MovieHub</p>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-full transition duration-300">
                Watch Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredCategories.map((category, index) => (
            <Link
              to={`/${category.title.toLowerCase().replace(" ", "-")}`}
              key={index}
              className="group"
            >
              <div className="bg-gray-300    rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className=" overflow-hidden flex justify-center items-center my-5">
                  <img
                    src={category.images[0]}
                    alt={category.title}
                    className="h-96 object-cover rounded-md mb-4 "
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 text-center">
                    {category.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Recently Added
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {moviesData.categories[0].images.slice(0, 5).map((image, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={image}
                alt={`New Release ${index + 1}`}
                className="h-96 object-cover rounded-md mb-4"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
