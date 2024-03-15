import { Router } from "express";
import { getCart, deleteProductToCart, deleteAllProducts, updateCart, addProductAndQuantity, purchaseCart, getUserTickets } from "../controllers/carts.controller.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const router = Router();

router.get("/:cid", userPassJwt(), handlePolicies(["USER"]), getCart);
router.delete("/product/:pid", userPassJwt(), handlePolicies(["USER"]), deleteProductToCart);
router.delete("/:cid", userPassJwt(), handlePolicies(["USER"]), deleteAllProducts);
router.put("/:cid/product/:pid", userPassJwt(), handlePolicies(["USER"]), updateCart);
router.post("/addproduct/:pid", userPassJwt(), handlePolicies(["USER"]), addProductAndQuantity);
router.post("/:cid/purchase", userPassJwt(), handlePolicies(["USER"]), purchaseCart);
router.get("/usertickets/:userEmail", userPassJwt(), handlePolicies(["USER"]), getUserTickets);

export default router;