import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("notLoggedFavourites")
  ? JSON.parse(localStorage.getItem("notLoggedFavourites"))
  : [];

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    addToFavourites: (state, action) => {
      const productId = action.payload;
      const existItem = state.find((x) => x === productId);
      if (!existItem) {
        console.log("change");
        const newState = [...state, productId];
        localStorage.setItem("notLoggedFavourites", JSON.stringify(newState));
        return newState;
      }
      return state;
    },
    removeFromFavourites: (state, action) => {
      const productId = action.payload;
      const newState = state.filter((x) => x !== productId);
      localStorage.setItem("notLoggedFavourites", JSON.stringify(newState));
      return newState;
    },
  },
});

export const { addToFavourites, removeFromFavourites } =
  favouritesSlice.actions;

export default favouritesSlice.reducer;
