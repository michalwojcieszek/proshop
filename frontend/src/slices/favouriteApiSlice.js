import { FAVOURITE_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const favouriteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createFavourite: builder.mutation({
      query: (favourite) => ({
        url: FAVOURITE_URL,
        method: "POST",
        body: { ...favourite },
      }),
    }),
    deleteFavourite: builder.mutation({
      query: (productId) => ({
        url: `${FAVOURITE_URL}/mine`,
        method: "DELETE",
        body: { productId },
      }),
    }),
    addFavouriteFromLocal: builder.mutation({
      query: (localFavourites) => ({
        url: `${FAVOURITE_URL}/mine`,
        method: "POST",
        body: { localFavourites },
      }),
    }),
  }),
});

export const {
  useCreateFavouriteMutation,
  useDeleteFavouriteMutation,
  useAddFavouriteFromLocalMutation,
} = favouriteApiSlice;
