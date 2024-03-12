import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("localFavourites")
  ? JSON.parse(localStorage.getItem("localFavourites"))
  : [];

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    addToFavourites: (state, action) => {
      const product = action.payload;
      const existItem = state.find((x) => x._id === product._id);
      if (!existItem) {
        console.log("change");
        const newState = [...state, product];
        localStorage.setItem("localFavourites", JSON.stringify(newState));
        return newState;
      }
      return state;
    },
    removeFromFavourites: (state, action) => {
      const productId = action.payload;
      const newState = state.filter((x) => x._id !== productId);
      localStorage.setItem("localFavourites", JSON.stringify(newState));
      return newState;
    },
    updateFavourites: (state, action) => {
      const favouritesArray = action.payload;
      localStorage.setItem("localFavourites", JSON.stringify(favouritesArray));
      return favouritesArray;
    },
    clearFavourites: (state, action) => {
      state = [];
      localStorage.setItem("localFavourites", JSON.stringify(state));
      return state;
    },
  },
});

export const {
  addToFavourites,
  removeFromFavourites,
  updateFavourites,
  clearFavourites,
} = favouritesSlice.actions;

export default favouritesSlice.reducer;
