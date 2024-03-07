import jwt from "jsonwebtoken";
import getEnvironment from "../config/process.config.js";

const env = getEnvironment();

export const userPassJwt = () => {//middleware para enviar tanto el usuario logueado, como un usuario invitado, sin enviar errores
    return async (req, res, next) => {
        const token = req.cookies.cookieToken;
        if (token !== undefined) {
            const user = jwt.verify(token, env.USERCOOKIESECRET);
            req.user = user;
        } else {
            req.user = null;
        }
        next();
    }
}