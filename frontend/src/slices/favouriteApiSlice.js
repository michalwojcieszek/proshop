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
  }),
});

export const { useCreateFavouriteMutation, useDeleteFavouriteMutation } =
  favouriteApiSlice;
