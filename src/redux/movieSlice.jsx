import { createSlice } from '@reduxjs/toolkit';
import moviesData from "../../movie.json";

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    categories: moviesData.categories,
    selectedMovie: null,
  },
  reducers: {
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
  },
});

export const { setSelectedMovie } = movieSlice.actions;
export default movieSlice.reducer;
