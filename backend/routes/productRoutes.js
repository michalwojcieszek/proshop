import express from "express";
import {
  getProductById,
  getProducts,
} from "../controllers/productController.js";

const router = express.Router();

// previously router.get("/", getProducts);
router.route("/").get(getProducts);

// previously router.get("/:id", getProductById);
router.route("/:id").get(getProductById);

export default router;
