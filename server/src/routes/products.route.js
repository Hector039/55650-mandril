import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";
import { productsService } from "../services/factory.js";
import getEnvironment from "../config/process.config.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const productsController = new ProductsController(productsService)
const env = getEnvironment();
const router = Router();

const persistenceProducts = env.PERSISTENCE === "DATABASE" ? productsController.getProductsPaginated : productsController.getProductsFs;

router.param("pid", productsController.param);
router.get("/", userPassJwt(), handlePolicies(["PUBLIC"]), persistenceProducts);
router.get("/:pid", handlePolicies(["PUBLIC"]), productsController.getProductById);
router.get("/searchproducts/:text", userPassJwt(), handlePolicies(["ADMIN"]), productsController.searchProducts);
router.post("/", userPassJwt(), handlePolicies(["ADMIN"]), productsController.saveProduct);
router.put("/:pid", userPassJwt(), handlePolicies(["ADMIN"]), productsController.updateProduct);
router.delete("/:pid", userPassJwt(), handlePolicies(["ADMIN"]), productsController.deleteProduct);

export default router;