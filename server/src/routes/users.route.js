import { Router } from "express";
import { userLogin, userSignIn, userForgotPass, gitHub, gitHubStrategy, google, googleStrategy, userLogout } from "../controllers/users.controller.js";
import { passportCall } from "../middlewares/passportCall.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { customResponses } from "../middlewares/customResponses.js";
import { isSessionOn } from "../middlewares/isSessionOn.js";

const router = Router();

router.post("/login", isSessionOn(), passportCall("login"), handlePolicies(["PUBLIC"]), customResponses, userLogin);
router.post("/signin", isSessionOn(), passportCall("signin"), handlePolicies(["PUBLIC"]), customResponses, userSignIn);
router.post("/forgot", isSessionOn(), handlePolicies(["PUBLIC"]), customResponses, userForgotPass);
router.get("/logout", handlePolicies(["PUBLIC"]), customResponses, userLogout);
router.get("/github", isSessionOn(), passportCall("github"), handlePolicies(["PUBLIC"]), customResponses, gitHub);
router.get("/ghstrategy", isSessionOn(), passportCall("github"), handlePolicies(["PUBLIC"]), customResponses, gitHubStrategy);
router.get("/google", isSessionOn(), passportCall("google"), handlePolicies(["PUBLIC"]), customResponses, google);
router.get("/googlestrategy", isSessionOn(), passportCall("google"), handlePolicies(["PUBLIC"]), customResponses, googleStrategy);

export default router;