import { Router } from "express";
import productsRouter from "./products.route.js";
import cartsRouter from "./carts.route.js";
import userRouter from "./users.route.js";
import contactRouter from "./contact.route.js";

const router = Router();

router.use("/api/carts", cartsRouter);
router.use("/api/products", productsRouter);
router.use("/api/sessions", userRouter);
router.use("/api/contact", contactRouter);

export default router;