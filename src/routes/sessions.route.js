import { Router } from "express";
import Users from "../dao/dbManagers/UserManager.js";
import { createHash } from "../utils.js";
import passport from "passport";

const router = Router();
const UserManager = new Users();

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), (req, res) => {

    req.session.user = req.user.firstName;
    req.session.role = req.user.email === "adminCoder@coder.com" ? "admin" : req.user.role;
    req.session.cart = req.user.cart;

    res.status(200).json({
        respuesta: `${req.session.user} ha ingresado correctamente`,
    });

});

router.get("/faillogin", (req, res) => {
    res.status(400).json({
        error: "Error de login de usuario"
    });
});

router.post("/forgot", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserManager.getUser(email);

        if (user === null) {
            res.status(401).json({
                error: "Usuario o contraseña incorrectos",
            });
            return;
        }

        const userUpdated = await UserManager.updateUser(email, createHash(password));

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

router.post("/signin", passport.authenticate("signin", { failureRedirect: "/api/sessions/failregister" }), async (req, res) => {
    req.session.user = req.user.firstName;
    req.session.role = req.user.email === "adminCoder@coder.com" ? "admin" : req.user.role;
    req.session.cart = req.user.cart;

    res.status(201).json({
        respuesta: `${req.session.user} ha ingresado correctamente`
    });
});

router.get("/failregister", (req, res) => {
    res.status(400).json({
        error: "Error al crear el usuario, intenta nuevamente"
    });
});

router.get("/github", passport.authenticate("github", { scope: ["user: email"] }), (req, res) => { });

router.get("/ghstrategy", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
    req.session.user = req.user.firstName;
    req.session.role = req.user.email === "adminCoder@coder.com" ? "admin" : req.user.role;
    req.session.cart = req.user.cart;

    res.redirect("/");
})

router.get("/google", passport.authenticate("google", { scope: ["profile"] }), (req, res) => { });

router.get("/googlestrategy", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    req.session.user = req.user.firstName;
    req.session.role = req.user.email === "adminCoder@coder.com" ? "admin" : req.user.role;
    req.session.cart = req.user.cart;

    res.redirect('/');
});

export default router;