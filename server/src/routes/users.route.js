import { Router } from "express";
import UsersController from "../controllers/users.controller.js"
import { usersService } from "../services/factory.js";
import { passportCall } from "../middlewares/passportCall.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
import { isSessionOn } from "../middlewares/isSessionOn.js";

const usersController = new UsersController(usersService);
const router = Router();

router.post("/login", isSessionOn(), passportCall("login"), handlePolicies(["PUBLIC"]), usersController.userLogin);
router.post("/signin", isSessionOn(), passportCall("signin"), handlePolicies(["PUBLIC"]), usersController.userSignIn);
router.post("/forgot", isSessionOn(), handlePolicies(["PUBLIC"]), usersController.userForgotPass);
router.get("/logout", handlePolicies(["PUBLIC"]), usersController.userLogout);
router.get("/github", isSessionOn(), passportCall("github"), handlePolicies(["PUBLIC"]), usersController.gitHub);
router.get("/ghstrategy", isSessionOn(), passportCall("github"), handlePolicies(["PUBLIC"]), usersController.gitHubStrategy);
router.get("/google", isSessionOn(), passportCall("google"), handlePolicies(["PUBLIC"]), usersController.google);
router.get("/googlestrategy", isSessionOn(), passportCall("google"), handlePolicies(["PUBLIC"]), usersController.googleStrategy);

export default router;