import { generateToken, createHash } from "../tools/utils.js";
import getEnvironment from "../config/process.config.js";
import mailer from "../tools/mailer.js";
import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";
import { generateUserErrorInfo } from "../tools/customErrors/info.js";

const env = getEnvironment();

export default class UsersController {
    constructor(service) {
        this.usersService = service;
    }

    userLogin = async (req, res, next) => {//post
        try {
            const email = req.user.email;
            const role = req.user.role;
            const cart = req.user.userCart;
            const cartId = typeof req.user.cart === "object" ? req.user.cart._id : req.user.cart;
            const name = req.user.firstName;
            const id = req.user._id;
            let token = generateToken({ email, role, cart, name, id, cartId });
            res.cookie("cookieToken", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
                secure: env.USERCOOKIESECRET
            }).status(200).send({ email, role, cart, name, id, cartId });
        } catch (error) {
            next(error)
        }
    }

    userSignIn = async (req, res, next) => {//post
        try {
            const email = req.user.email;
            const role = req.user.role;
            const cart = req.user.userCart;
            const cartId = typeof req.user.cart === "object" ? req.user.cart._id : req.user.cart;
            const name = req.user.firstName;
            const id = req.user._id;
            let token = generateToken({ email, role, cart, name, id, cartId });
            res.cookie("cookieToken", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
                secure: env.USERCOOKIESECRET
            }).status(200).send({ email, role, cart, name, id, cartId });
        } catch (error) {
            next(error)
        }
    }

    userForgotPass = async (req, res, next) => {//post
        const { email, password } = req.body;
        try {
            const user = await this.usersService.getUser(email);
            if (user === null) {
                CustomError.createError({
                    name: "Error restaurando contraseña",
                    message: "Usuario no encontrado.",
                    cause: generateUserErrorInfo(req.body),
                    code: TErrors.INVALID_TYPES,
                });
            }
            if (password.length < 3) {
                CustomError.createError({
                    name: "Error restaurando contraseña",
                    message: "Contraseña inválida",
                    cause: generateUserErrorInfo(req.body),
                    code: TErrors.INVALID_TYPES,
                });
            }
            await this.usersService.updateUser(email, createHash(password));
            const mailResult = await mailer({ mail: email, name: user.firstName }, "Se cambió tu contraseña.")
            res.status(200).send(mailResult);
        } catch (error) {
            next(error)
        }
    }

    userLogout = async (req, res) => {
        res.clearCookie('cookieToken');
        return res.status(200).send("Usuario deslogueado!");
    }

    gitHub = async (req, res) => { };//get

    gitHubStrategy = async (req, res) => {//get
        const email = req.user.email;
        const role = req.user.role;
        const cart = req.user.userCart;
        const cartId = typeof req.user.cart === "object" ? req.user.cart._id : req.user.cart;
        const name = req.user.firstName;
        const id = req.user._id;
        const photo = req.user.photo;
        let token = generateToken({ email, role, cart, name, photo, id, cartId });
        res.cookie("cookieToken", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            secure: env.USERCOOKIESECRET
        }).redirect("http://localhost:5173/");
    }

    google = async (req, res) => { };//get

    googleStrategy = async (req, res) => {//get
        const email = req.user.email;
        const role = req.user.role;
        const cart = req.user.userCart;
        const cartId = typeof req.user.cart === "object" ? req.user.cart._id : req.user.cart;
        const name = req.user.firstName;
        const id = req.user._id;
        const photo = req.user.photo;
        let token = generateToken({ email, role, cart, name, photo, id, cartId });
        res.cookie("cookieToken", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            secure: env.USERCOOKIESECRET
        }).redirect("http://localhost:5173/");
    }
}

