import { Router } from "express";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { fakerProducts } from "../controllers/fakerProducts.controller.js";

const router = Router();

router.get("/", handlePolicies(["PUBLIC"]), fakerProducts);

export default router;