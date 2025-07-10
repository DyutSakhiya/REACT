import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import MovieNav from "./components/MovieNav";
import Movie from "./components/movie";
import Home from "./components/Home";
import MovieDetail from "./components/MovieDetail";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <MovieNav />
          <main className="pt-20 pb-10">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/bollywood" element={<Movie category="Bollywood" />} />
              <Route path="/hollywood" element={<Movie category="Hollywood" />} />
              <Route path="/gujarati" element={<Movie category="Gujarati" />} />
              <Route path="/web-series" element={<Movie category="Web-Series" />} />
              <Route path="/movie/:category/:id" element={<MovieDetail />} />
            </Routes>
          </main>
          <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto text-center">
            <p>© 2025 MovieHub. All rights reserved.</p>
          </div>
        </footer>
        </div>
      </Router>
    </Provider>
  );
};

export default App;