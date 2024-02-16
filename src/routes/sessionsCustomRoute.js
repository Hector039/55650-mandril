import CustomRouter from "./customRoute.js";
import Users from "../dao/dbManagers/UserManager.js";
import { generateToken, isValidPass, createHash } from "../utils.js";
import CartManager from "../dao/dbManagers/CartManager.js";

const UserManager = new Users();
const cartManager = new CartManager();

export default class SessionsRouter extends CustomRouter {
    init() {

        this.get("/current", "jwt", ["USER", "USER_PREMIUM"], (req, res) => {
            res.sendSuccess(req.user);
        })

        this.post("/login", ["PUBLIC"], async (req, res) => {
            const { email, password } = req.body;
            try {
                const user = await UserManager.getUser(email);

                if (user === null) {
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
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true,
                }).sendSuccess({ token });
            } catch (error) {
                res.sendServerError("Error Interno del Servidor");
            }
        })

        this.post("/signin", ["PUBLIC"], async (req, res) => {
            const { firstName, lastName, email, password } = req.body;
            try {
                const user = await UserManager.getUser(email);
                if (user) {
                    res.sendUserError("El usuario ya existe");
                    return;
                };

                const newCart = await cartManager.saveCart();

                await UserManager.saveUser({
                    firstName,
                    lastName,
                    email,
                    password: createHash(password),
                    cart: newCart._id
                });

                const userUpdated = await UserManager.getUser(email);

                const mail = userUpdated.email;
                const role = userUpdated.role;
                const cart = userUpdated.cart;
                const name = userUpdated.firstName;
                const id = userUpdated._id;

                let token = generateToken({ mail, role, cart, name, id });
                res.cookie("cookieToken", token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true,
                }).sendSuccess({ token });
            } catch (error) {
                res.sendServerError("Error Interno del Servidor");
            }
        })

        this.post("/forgot", ["PUBLIC"], async (req, res) => {
            const { email, password } = req.body;
            try {
                const user = await UserManager.getUser(email);

                if (user === null) {
                    res.sendUserError("Usuario no encontrado");
                    return;
                }

                const userUpdated = await UserManager.updateUser(email, createHash(password));

                res.sendSuccess({ userUpdated });
            } catch (error) {
                res.status(500).json({
                    error: error.message,
                })
            }
        })

        this.get("/github", "github", ["PUBLIC"], (req, res) => { });

        this.get("/ghstrategy", "github", ["PUBLIC"], (req, res) => {
            const id = req.user._id;
            const mail = req.user.email;
            const role = req.user.role;
            const cart = req.user.cart;
            const name = req.user.firstName;
            const photo = req.user.photo;
            let token = generateToken({ mail, role, cart, name, photo, id });
            res.cookie("cookieToken", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
            }).redirect('/');
        })

        this.get("/google", "google", ["PUBLIC"], (req, res) => { });

        this.get("/googlestrategy", "google", ["PUBLIC"], (req, res) => {
            const id = req.user._id;
            const mail = req.user.email;
            const role = req.user.role;
            const cart = req.user.cart;
            const name = req.user.firstName;
            const photo = req.user.photo;
            let token = generateToken({ mail, role, cart, name, photo, id });
            res.cookie("cookieToken", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
            }).redirect('/');
        })
    }

}
