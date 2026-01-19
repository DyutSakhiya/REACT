import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        state.cart.push({ ...action.payload, qty: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload.id);
    },
    incrementQty: (state, action) => {
      const item = state.cart.find(item => item.id === action.payload.id);
      if (item) item.qty += 1;
    },
    decrementQty: (state, action) => {
      const item = state.cart.find(item => item.id === action.payload.id);
      if (item && item.qty > 1) {
        item.qty -= 1;
      } else {
        state.cart = state.cart.filter(item => item.id !== action.payload.id);
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, incrementQty, decrementQty, clearCart } = CartSlice.actions;
export default CartSlice.reducer;