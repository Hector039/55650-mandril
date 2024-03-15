import { Router } from "express";
import { sendContactMail } from "../controllers/contact.controller.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";

const router = Router();

router.post("/", handlePolicies(["PUBLIC"]), sendContactMail);

export default router;