import express from "express";
import {
  addFavourite,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  deleteFavourite,
} from "../controllers/favouriteController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addFavourite);

router.route("/mine").delete(protect, deleteFavourite);

router.route("/:id").get(protect, getOrderById);

router.route("/:id/pay").put(protect, updateOrderToPaid);

router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
