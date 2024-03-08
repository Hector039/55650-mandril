import { Router } from "express";
import { getCart, deleteProductToCart, deleteAllProducts, updateCart, addProductAndQuantity, purchaseCart, getUserTickets } from "../controllers/carts.controller.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { customResponses } from "../middlewares/customResponses.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const router = Router();

router.get("/:cid", userPassJwt(), handlePolicies(["USER"]), customResponses, getCart);
router.delete("/product/:pid", userPassJwt(), handlePolicies(["USER"]), customResponses, deleteProductToCart);
router.delete("/:cid", userPassJwt(), handlePolicies(["USER"]), customResponses, deleteAllProducts);
router.put("/:cid/product/:pid", userPassJwt(), handlePolicies(["USER"]), customResponses, updateCart);
router.post("/addproduct/:pid", userPassJwt(), handlePolicies(["USER"]), customResponses, addProductAndQuantity);
router.post("/:cid/purchase", userPassJwt(), handlePolicies(["USER"]), customResponses, purchaseCart);
router.get("/usertickets/:userEmail", userPassJwt(), handlePolicies(["USER"]), customResponses, getUserTickets);

export default router;