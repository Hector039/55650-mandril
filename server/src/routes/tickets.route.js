import { Router } from "express";
import TicketsController from "../controllers/tickets.controller.js";
import { ticketsService, cartsService } from "../services/index.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { userPassJwt } from "../middlewares/userPassJwt.js";

const ticketsController = new TicketsController(ticketsService, cartsService)
const router = Router();

router.post("/:cid/purchase", userPassJwt(), handlePolicies(["USER"]), ticketsController.purchaseCart);
router.get("/:userEmail", userPassJwt(), handlePolicies(["USER"]), ticketsController.getUserTickets);

export default router;