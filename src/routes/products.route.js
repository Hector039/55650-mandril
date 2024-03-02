import { Router } from "express";
import { param, getProductsPaginated, getProductById, saveProduct, updateProduct, deleteProduct, getProductsFs, searchProducts, searchProductsFs } from "../controllers/products.controller.js";
import getEnvironment from "../config/process.config.js";
import { userPassJwt } from "../middlewares/userPassJwt.js"
import { authorization } from "../middlewares/userAuthorization.js"

const env = getEnvironment();
const router = Router();

const persistenceProducts = env.PERSISTENCE === "DATABASE" ? getProductsPaginated : getProductsFs;
const persistenceProductsSearch = env.PERSISTENCE === "DATABASE" ? searchProducts : searchProductsFs;

router.param("pid", param);
router.get("/", userPassJwt(), persistenceProducts);
router.get("/searchproducts/:text", userPassJwt(), authorization("admin"), persistenceProductsSearch);
router.get("/:pid", getProductById);
router.post("/", saveProduct);
router.put("/:pid", updateProduct);
router.delete("/:pid", deleteProduct);

export default router;