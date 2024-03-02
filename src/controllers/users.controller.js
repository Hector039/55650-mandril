import { usersDao } from "../dao/index.js";
import { cartsDao } from "../dao/index.js";
import { generateToken, isValidPass, createHash } from "../tools/utils.js";
import getEnvironment from "../config/process.config.js";

const env = getEnvironment();

async function userLogin(req, res) {//post
    const { email, password } = req.body;
    try {
        const user = await usersDao.getUser(email);
        if (user === null || user === undefined) {
            res.sendUserError("Usuario no encontrado");
            return;
        }
        if (isValidPass(password, user.password) === false) {
            res.sendUserError("Usuario o contraseña incorrectos");
            return;
        }
        const mail = user.email;
        const role = user.role;
        const cart = user.cart;
        const name = user.firstName;
        const id = user._id;
        let token = generateToken({ mail, role, cart, name, id });

        res.cookie("cookieToken", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            secure: env.USERCOOKIESECRET
        }).sendSuccess(token);
    } catch (error) {
        res.sendServerError("Error Interno del Servidor");
    }
}

async function userSignIn(req, res) {//post
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = await usersDao.getUser(email);
        if (user !== undefined) {
            res.sendUserError("El usuario ya existe");
            return;
        };
        const newCart = await cartsDao.saveCart();
        await usersDao.saveUser({
            firstName,
            lastName,
            email,
            password: createHash(password),
            cart: newCart._id
        });
        const userUpdated = await usersDao.getUser(email);
        const mail = userUpdated.email;
        const role = userUpdated.role;
        const cart = userUpdated.cart;
        const name = userUpdated.firstName;
        const id = userUpdated._id;
        let token = generateToken({ mail, role, cart, name, id });
        res.cookie("cookieToken", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            secure: env.USERCOOKIESECRET
        }).sendSuccess(token);
    } catch (error) {
        res.sendServerError("Error Interno del Servidor");
    }
}

async function userForgotPass(req, res) {//post
    const { email, password } = req.body;
    try {
        const user = await usersDao.getUser(email);
        if (user === null) {
            res.sendUserError("Usuario no encontrado");
            return;
        }
        const userUpdated = await usersDao.updateUser(email, createHash(password));
        res.sendSuccess({ userUpdated });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
}

async function userLogout(req, res) {
    res.clearCookie('cookieToken');
    return res.sendSuccess("Usuario deslogueado!");
}

async function gitHub(req, res) { };//get

async function gitHubStrategy(req, res) {//get
    const id = req.user._id;
    const mail = req.user.email;
    const role = req.user.role;
    const cart = req.user.cart;
    const name = req.user.firstName;
    const photo = req.user.photo;
    let token = generateToken({ mail, role, cart, name, photo, id });
    res.cookie("cookieToken", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        secure: env.USERCOOKIESECRET
    }).sendSuccess(token);
    /* .redirect('/') */
}

async function google(req, res) { };//get

async function googleStrategy(req, res) {//get
    const id = req.user._id;
    const mail = req.user.email;
    const role = req.user.role;
    const cart = req.user.cart;
    const name = req.user.firstName;
    const photo = req.user.photo;
    let token = generateToken({ mail, role, cart, name, photo, id });
    res.cookie("cookieToken", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        secure: env.USERCOOKIESECRET
    }).sendSuccess(token);
    /* .redirect('/') */
}

export { userLogin, userSignIn, userForgotPass, gitHub, gitHubStrategy, google, googleStrategy, userLogout };