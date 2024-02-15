import express from "express";
import {
  getProductById,
  getProducts,
} from "../controllers/productController.js";
import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
const router = express.Router();

// previously router.get("/", getProducts);
router.route("/").get(getProducts);

// previously router.get("/:id", getProductById);
router.route("/:id").get(getProductById);

export default router;
