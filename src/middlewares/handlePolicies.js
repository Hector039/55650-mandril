import jwt from "jsonwebtoken";
import getEnvironment from "../config/process.config.js";

const env = getEnvironment();

export const handlePolicies = policies => (req, res, next) => {
    if (policies[0] === "PUBLIC") return next();
    let token = null;
    if (!req && !req.cookies) {
        return res.status(401).send({ status: "Error", error: "Unautorized" });
    }
    token = req.cookies["cookieToken"];
    let user = jwt.verify(token, env.USERCOOKIESECRET);
    if (!policies.includes(user.role.toUpperCase())) return res.status(403).send({ status: "Error", error: "El rol indicado no existe" });
    req.user = user;
    next();
}