import { configureStore } from "@reduxjs/toolkit";
import CartSlice from "./slices/cartSlice";
import CategorySlice from "./slices/categorySlice";
import SearchSlice from "./slices/searchSlice";
import authReducer from "./slices/authSlice";

const Store = configureStore({
  reducer: {
    cart: CartSlice,
    category: CategorySlice,
    search: SearchSlice,
    auth: authReducer,
  },
});

export default Store;