import { Router } from "express";
import Users from "../dao/dbManagers/UserManager.js";
import { createHash } from "../utils.js";
import passport from "passport";

const router = Router();
const UserManager = new Users();

router.post("/login", passport.authenticate("login", { failureRedirect: "/failLogin" }), (req, res) => {

    if (!req.user) {
        res.status(400).json({
            error: "Usuario o contraseña incorrectos",
        });
        return;
    }

    req.session.user = req.user.firstName;
    req.session.role = req.user.email === "adminCoder@coder.com" ? "admin" : req.user.role;
    req.session.cart = req.user.cart;

    res.status(200).json({
        respuesta: `${req.session.user} ha ingresado correctamente`,
    });

});

router.get("/failLogin", (req, res) => {
    res.status(400).json({
        error: "Error de login de usuario"
    });
});

router.post("/forgot", async (req, res) => {
    const { email, repassword } = req.body;
    try {
        const user = await UserManager.getUser(email);

        if (user === null) {
            res.status(401).json({
                error: "Usuario o contraseña incorrectos",
            });
            return;
        }

        const userUpdated = await UserManager.updateUser(email, createHash(repassword));

        req.session.user = userUpdated.firstName;
        req.session.role = userUpdated.email === "adminCoder@coder.com" ? "admin" : userUpdated.role;
        req.session.cart = userUpdated.cart;

        res.status(200).json({
            status: "ok"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

router.post("/signin", passport.authenticate("signin", { failureRedirect: "/failregister" }), async (req, res) => {
    res.status(201).json({
        respuesta: `${req.session.user} ha ingresado correctamente`
    });
});

router.get("/failRegister", (req, res) => {
    res.status(400).json({
        error: "Error al crear el usuario"
    });
});

/* router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserManager.getUser(email);

        if (user === null) {
            res.status(400).json({
                error: "Usuario o contraseña incorrectos",
            });
            return;
        }

        if (!isValidPass(user.password, password)) {
            res.status(403).json({
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

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
}); */

/* router.post("/signin", async (req, res) => {
    const { firstName, lastName, email, password, repassword } = req.body;
    try {
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
            password: createHash(password),
            cart
        });

        if (user === null) {
            res.status(400).json({
                error: "Error al crear el usuario",
            });
            return;
        }

        const userUpdated = await UserManager.getUser(email);

        req.session.user = userUpdated.firstName;
        req.session.role = userUpdated.email === "adminCoder@coder.com" ? "admin" : userUpdated.role;
        req.session.cart = userUpdated.cart;

        res.status(201).json({
            respuesta: `${req.session.user} ha ingresado correctamente`,
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
}); */

export default router;