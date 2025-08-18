import { createSlice } from "@reduxjs/toolkit";

const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    const storedAuth = localStorage.getItem('flavoroAdminAuth');
    if (storedAuth) {
      try {
        return JSON.parse(storedAuth);
      } catch (e) {
        localStorage.removeItem('flavoroAdminAuth');
      }
    }
  }
  return {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isAdmin: false
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.email?.includes('@flavoro.admin') || action.payload.isAdmin || false;
      state.loading = false;
      localStorage.setItem('flavoroAdminAuth', JSON.stringify(state));
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.isAdmin || false;
      state.loading = false;
      localStorage.setItem('flavoroAdminAuth', JSON.stringify(state));
    },
    registerFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      localStorage.removeItem('flavoroAdminAuth');
    },
    loadAuth: (state) => {
      const storedAuth = localStorage.getItem('flavoroAdminAuth');
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        state.user = parsedAuth.user;
        state.isAuthenticated = parsedAuth.isAuthenticated;
        state.isAdmin = parsedAuth.isAdmin;
      }
    },
    setHotelId: (state, action) => {
      if (state.user) {
        state.user.hotel_id = action.payload;
        localStorage.setItem('flavoroAdminAuth', JSON.stringify(state));
      }
    }
  }
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  loadAuth,
  setHotelId
} = authSlice.actions;

export default authSlice.reducer;