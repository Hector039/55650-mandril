import { Router } from "express";
import { param, getProductsPaginated, getProductById, saveProduct, updateProduct, deleteProduct, getProductsFs, searchProducts } from "../controllers/products.controller.js";
import getEnvironment from "../config/process.config.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { customResponses } from "../middlewares/customResponses.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const env = getEnvironment();
const router = Router();

const persistenceProducts = env.PERSISTENCE === "DATABASE" ? getProductsPaginated : getProductsFs;

router.param("pid", param);
router.get("/", userPassJwt(), handlePolicies(["PUBLIC"]), customResponses, persistenceProducts);
router.get("/:pid", handlePolicies(["PUBLIC"]), customResponses, getProductById);
router.get("/searchproducts/:text", userPassJwt(), handlePolicies(["ADMIN"]), customResponses, searchProducts);
router.post("/", userPassJwt(), handlePolicies(["ADMIN"]), customResponses, saveProduct);
router.put("/:pid", userPassJwt(), handlePolicies(["ADMIN"]), customResponses, updateProduct);
router.delete("/:pid", userPassJwt(), handlePolicies(["ADMIN"]), customResponses, deleteProduct);

export default router;