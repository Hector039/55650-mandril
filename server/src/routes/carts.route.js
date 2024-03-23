import { Router } from "express";
import CartsController from "../controllers/carts.controller.js";
import { cartsService, productsService } from "../services/factory.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const cartsController = new CartsController(cartsService, productsService);
const router = Router();

router.get("/:cid", userPassJwt(), handlePolicies(["USER"]), cartsController.getCart);
router.delete("/product/:pid", userPassJwt(), handlePolicies(["USER"]), cartsController.deleteProductToCart);
router.delete("/:cid", userPassJwt(), handlePolicies(["USER"]), cartsController.deleteAllProducts);
router.put("/:cid/product/:pid", userPassJwt(), handlePolicies(["USER"]), cartsController.updateCart);
router.post("/addproduct/:pid", userPassJwt(), handlePolicies(["USER"]), cartsController.addProductAndQuantity);

export default router;