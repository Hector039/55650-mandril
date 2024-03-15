import { Router } from "express";
import { userLogin, userSignIn, userForgotPass, gitHub, gitHubStrategy, google, googleStrategy, userLogout } from "../controllers/users.controller.js";
import { passportCall } from "../middlewares/passportCall.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { isSessionOn } from "../middlewares/isSessionOn.js";

const router = Router();

router.post("/login", isSessionOn(), passportCall("login"), handlePolicies(["PUBLIC"]), userLogin);
router.post("/signin", isSessionOn(), passportCall("signin"), handlePolicies(["PUBLIC"]), userSignIn);
router.post("/forgot", isSessionOn(), handlePolicies(["PUBLIC"]), userForgotPass);
router.get("/logout", handlePolicies(["PUBLIC"]), userLogout);
router.get("/github", isSessionOn(), passportCall("github"), handlePolicies(["PUBLIC"]), gitHub);
router.get("/ghstrategy", isSessionOn(), passportCall("github"), handlePolicies(["PUBLIC"]), gitHubStrategy);
router.get("/google", isSessionOn(), passportCall("google"), handlePolicies(["PUBLIC"]), google);
router.get("/googlestrategy", isSessionOn(), passportCall("google"), handlePolicies(["PUBLIC"]), googleStrategy);

export default router;