import express from "express";
import {
  addFavourite,
  deleteFavourite,
  addFavouriteFromLocal,
} from "../controllers/favouriteController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addFavourite);

router
  .route("/mine")
  .delete(protect, deleteFavourite)
  .post(protect, addFavouriteFromLocal);

export default router;
