import { Router } from "express";
import { param, getProductsPaginated, getProductById, saveProduct, updateProduct, deleteProduct, getProductsFs, searchProducts } from "../controllers/products.controller.js";
import getEnvironment from "../config/process.config.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const env = getEnvironment();
const router = Router();

const persistenceProducts = env.PERSISTENCE === "DATABASE" ? getProductsPaginated : getProductsFs;

router.param("pid", param);
router.get("/", userPassJwt(), handlePolicies(["PUBLIC"]), persistenceProducts);
router.get("/:pid", handlePolicies(["PUBLIC"]), getProductById);
router.get("/searchproducts/:text", userPassJwt(), handlePolicies(["ADMIN"]), searchProducts);
router.post("/", userPassJwt(), handlePolicies(["ADMIN"]), saveProduct);
router.put("/:pid", userPassJwt(), handlePolicies(["ADMIN"]), updateProduct);
router.delete("/:pid", userPassJwt(), handlePolicies(["ADMIN"]), deleteProduct);

export default router;