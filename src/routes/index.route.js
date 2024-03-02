import { Router } from "express";
import productsRouter from "./products.route.js";
import cartsRouter from "./carts.route.js";
import userRouter from "./users.route.js";

const router = Router();

router.use("/api/carts", cartsRouter);
router.use("/api/products", productsRouter);
router.use("/api/sessions", userRouter);

export default router;