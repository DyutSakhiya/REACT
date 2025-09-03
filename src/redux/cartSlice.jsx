import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
    currentOrderId: null,
    orderSession: null
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        // If item exists, increase quantity
        existingItem.qty += action.payload.qty || 1;
      } else {
        // If item doesn't exist, add it to cart
        state.cart.push({
          ...action.payload,
          qty: action.payload.qty || 1
        });
      }
    },
    
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
    
    updateQuantity: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cart.find(item => item.id === id);
      if (item) {
        if (qty <= 0) {
          // Remove item if quantity is 0 or less
          state.cart = state.cart.filter(item => item.id !== id);
        } else {
          item.qty = qty;
        }
      }
    },
    
    incrementQty: (state, action) => {
      const item = state.cart.find(item => item.id === action.payload);
      if (item) {
        item.qty += 1;
      }
    },
    
    decrementQty: (state, action) => {
      const item = state.cart.find(item => item.id === action.payload);
      if (item && item.qty > 1) {
        item.qty -= 1;
      } else if (item && item.qty === 1) {
        // Remove item if quantity becomes 0
        state.cart = state.cart.filter(item => item.id !== action.payload);
      }
    },
    
    clearCart: (state) => {
      state.cart = [];
    },
    
    setCurrentOrderId: (state, action) => {
      state.currentOrderId = action.payload;
    },
    
    setOrderSession: (state, action) => {
      state.orderSession = action.payload;
    },
    
    clearOrderSession: (state) => {
      state.currentOrderId = null;
      state.orderSession = null;
    }
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity,
  incrementQty,
  decrementQty,
  clearCart,
  setCurrentOrderId,
  setOrderSession,
  clearOrderSession
} = cartSlice.actions;

export default cartSlice.reducer;