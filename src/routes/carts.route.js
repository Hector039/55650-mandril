import { Router } from "express";
import { getCart, deleteProductToCart, deleteAllProducts, updateCart, addProductAndQuantity } from "../controllers/carts.controller.js";
import { userPassJwt } from "../middlewares/userPassJwt.js"
const router = Router();

router.get("/:cid", userPassJwt(), getCart);
router.delete("/product/:pid", userPassJwt(), deleteProductToCart);
router.delete("/:cid", deleteAllProducts);
router.put("/:cid/product/:pid", updateCart);
router.post("/addproduct/:pid", userPassJwt(), addProductAndQuantity);

export default router;