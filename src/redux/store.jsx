import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import searchSlice from './slices/SearchSlice';
import hotelSlice from './slices/hotelSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    search: searchSlice,
    hotel: hotelSlice, // This now manages isolated hotel data
  },
});

export default store;