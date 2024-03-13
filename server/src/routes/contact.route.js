import { Router } from "express";
import { sendContactMail } from "../controllers/contact.controller.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { customResponses } from "../middlewares/customResponses.js";

const router = Router();

router.post("/", handlePolicies(["PUBLIC"]), customResponses, sendContactMail);

export default router;