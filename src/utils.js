import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPass = (password, userPassword) => bcrypt.compareSync(password, userPassword);


export const generateToken = (user) => {
    const token = jwt.sign( user, process.env.USERCOOKIESECRET, { expiresIn: "1h" });
    return token;
};

export const userPassJwt = () => {//middleware para enviar al home tanto el usuario logueado, como un usuario invitado, sin enviar errores
    return async (req, res, next) => {
        const token = req.cookies.cookieToken;
        if (token !== undefined){
            const user = jwt.verify(token, process.env.USERCOOKIESECRET);
            req.user = user;
        }else {
            const user = {
                name: "Guest User",
                role: "user"
            }
            req.user = user;
        }
        next();
    }
}

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: "No autorizado" });
        if (req.user.role != role) return res.status(403).send({ error: "Sin permisos" });
        next();
    }
}

export const isSessionOn = () => {//middleware para evitar vovler al login o sigin cuando está el usuario logueado con jwt
    return async (req, res, next) => {
        const token = req.cookies.cookieToken;
        if(token === undefined){
            next();
        }else{
            res.redirect("/");
        }
    }
}