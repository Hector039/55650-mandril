import { Router } from "express";
import productsRouter from "./products.route.js"
import cartsRouter from "./carts.route.js";
import viewsRouter from "./views.route.js";
import chatRouter from "./chat.route.js";
//import sessionsRouter from "./sessions.route.js";
import SessionsRouter from "./sessionsCustomRoute.js";

const router = Router();

router.use("/api/carts", cartsRouter);
router.use("/", viewsRouter);
router.use("/api/products", productsRouter);
router.use("/chat", chatRouter);
//router.use("/api/sessions", sessionsRouter);

const sessionsRouter = new SessionsRouter();
router.use("/api/sessions", sessionsRouter.router);

export default router;