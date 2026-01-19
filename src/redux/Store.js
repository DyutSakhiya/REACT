import { configureStore } from "@reduxjs/toolkit";
import CartSlice from "../redux/slices/cartSlice";
import CategorySlice from "./slices/CategorySlice";
import SearchSlice from "./slices/SearchSlice";
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