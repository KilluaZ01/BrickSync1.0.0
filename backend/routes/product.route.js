import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createProduct);
router.get("/", verifyToken, getProducts);
router.put("/update/:id", verifyToken, updateProduct);
router.delete("/delete/:id", verifyToken, deleteProduct);

export default router;
