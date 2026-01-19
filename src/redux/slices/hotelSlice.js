import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch hotel data
export const fetchHotelData = createAsyncThunk(
  'hotel/fetchHotelData',
  async (hotelId) => {
    try {
      const response = await fetch(`/api/hotel/${hotelId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch hotel data');
      }
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error');
    }
  }
);

const hotelSlice = createSlice({
  name: 'hotel',
  initialState: {
    hotelname: '',
    hotelLogo: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearHotelData: (state) => {
      state.hotelname = '';
      state.hotelLogo = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotelData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelData.fulfilled, (state, action) => {
        state.loading = false;
        state.hotelname = action.payload.hotelname || '';
        state.hotelLogo = action.payload.hotelLogo || null;
      })
      .addCase(fetchHotelData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearHotelData } = hotelSlice.actions;
export default hotelSlice.reducer;