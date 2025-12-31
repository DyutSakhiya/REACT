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
        existingItem.qty += action.payload.quantity || 1;
      } else {
        state.cart.push({ 
          ...action.payload, 
          qty: action.payload.quantity || 1 
        });
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
    updateItemQuantity: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cart.find(item => item.id === id);
      if (item) {
        if (qty === 0) {
          state.cart = state.cart.filter(item => item.id !== id);
        } else {
          item.qty = qty;
        }
      }
    },
    syncCartItem: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cart.find(item => item.id === id);
      if (item) {
        item.qty = qty;
      }
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  incrementQty, 
  decrementQty, 
  clearCart,
  updateItemQuantity,
  syncCartItem
} = CartSlice.actions;
export default CartSlice.reducer;