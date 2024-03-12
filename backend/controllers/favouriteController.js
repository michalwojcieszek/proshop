import asyncHandler from "../middleware/asyncHandler.js";
import Favourite from "../models/favouriteModel.js";

// @desc Create new favourite
// @route POST /api/favourite
// @access Private
const addFavourite = asyncHandler(async (req, res) => {
  const { _id, name, image, price } = req.body;
  const currentUser = req.user._id;

  const existingFavourite = await Favourite.findOne({ user: currentUser });

  if (existingFavourite) {
    existingFavourite.favouriteItems.push({ _id, name, image, price });
    const updatedFavourite = await existingFavourite.save();
    res.status(201).json(updatedFavourite);
  } else {
    const favourite = new Favourite({
      user: currentUser,
      favouriteItems: [{ _id, name, image, price }],
    });
    const createdFavourite = await favourite.save();
    res.status(201).json(createdFavourite);
  }
});

// @desc Delete a favourite
// @route DELETE /api/favourite/mine
// @access Private
const deleteFavourite = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const currentUser = req.user._id;

  try {
    const existingFavourite = await Favourite.findOne({ user: currentUser });

    if (!existingFavourite) {
      return res.status(404).json({ message: "Favourite not found" });
    }

    existingFavourite.favouriteItems = existingFavourite.favouriteItems.filter(
      (product) => product._id.toString() !== productId
    );
    await existingFavourite.save();
    res.status(201).json(existingFavourite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @desc POST favourite from logged user
// @route POST /api/favourite/mine
// @access Private
const addFavouriteFromLocal = asyncHandler(async (req, res) => {
  const { localFavourites } = req.body;
  const currentUser = req.user._id;

  const existingFavourite = await Favourite.findOne({ user: currentUser });

  if (existingFavourite) {
    const newFavourite = localFavourites.filter(
      (localItem) =>
        !existingFavourite.favouriteItems.some(
          (existingItem) => existingItem._id.toString() === localItem._id
        )
    );
    existingFavourite.favouriteItems = [
      ...existingFavourite.favouriteItems,
      ...newFavourite,
    ];
    const updatedFavourite = await existingFavourite.save();
    res.status(201).json(updatedFavourite);
  } else {
    const favourite = new Favourite({
      user: currentUser,
      favouriteItems: [...localFavourites],
    });
    const createdFavourite = await favourite.save();
    res.status(201).json(createdFavourite);
  }
});

export { addFavourite, deleteFavourite, addFavouriteFromLocal };
