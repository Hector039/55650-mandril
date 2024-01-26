import { Router } from "express";
import Users from "../dao/dbManagers/UserManager.js";
import CartManager from "../dao/dbManagers/CartManager.js";

const router = Router();
const UserManager = new Users();
const cartManager = new CartManager();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await UserManager.getUser(email, password);

    if (user === null) {
        res.status(400).json({
            error: "Usuario o contraseña incorrectos",
        });
        return;
    }

    req.session.user = user.firstName;
    req.session.role = user.email === "adminCoder@coder.com" ? "admin" : user.role;
    req.session.cart = user.cart;

    res.status(200).json({
        respuesta: `${req.session.user} ha ingresado correctamente`,
    });

});

router.post("/signin", async (req, res) => {
    const { firstName, lastName, email, password, repassword } = req.body;

    if (password !== repassword) {
        res.status(400).json({
            error: "El password no coincide, vuelve a intentarlo.",
        });
        return;
    };

    const newCart = await cartManager.saveCart();
    const cart = newCart._id;

    const user = await UserManager.saveUser({
        firstName,
        lastName,
        email,
        password,
        cart
    });

    if (user === null) {
        res.status(400).json({
            error: "Error al crear el usuario",
        });
        return;
    }

    const userUpdated = await UserManager.getUser(email, password);

    req.session.user = userUpdated.firstName;
    req.session.role = userUpdated.email === "adminCoder@coder.com" ? "admin" : userUpdated.role;
    req.session.cart = userUpdated.cart;

    res.status(201).json({
        respuesta: `${req.session.user} ha ingresado correctamente`,
    });

});

export default router;