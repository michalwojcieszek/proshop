import mongoose from "mongoose";

const favouriteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    favouriteItems: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Favourite = mongoose.model("Favourite", favouriteSchema);

export default Favourite;
