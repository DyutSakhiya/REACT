import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './movieSlice';
import cartReducer from './cartSlice'; 

const store = configureStore({
  reducer: {
    movies: movieReducer,
    cart: cartReducer, 
  },
});

export default store;
