import passport from "passport";
import local from "passport-local";
import Users from "../dao/dbManagers/UserManager.js";
import CartManager from "../dao/dbManagers/CartManager.js";
import { createHash, isValidPass } from "../utils.js";

const UserManager = new Users();
const cartManager = new CartManager();

const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("signin", new localStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, done) => {
            const { firstName, lastName, email, password, repassword } = req.body;
            try {
                const user = await UserManager.getUser(email);
                if (user) {
                    return done(null, false, { message: "El Usuario ya existe" });
                };

                if (password !== repassword) {
                    res.status(400).json({
                        error: "El password no coincide, vuelve a intentarlo.",
                    });
                    return;
                };

                const newCart = await cartManager.saveCart();
                const cart = newCart._id;

                await UserManager.saveUser({
                    firstName,
                    lastName,
                    email,
                    password: createHash(password),
                    cart
                });

                const userUpdated = await UserManager.getUser(email);

                req.session.user = userUpdated.firstName;
                req.session.role = userUpdated.email === "adminCoder@coder.com" ? "admin" : userUpdated.role;
                req.session.cart = userUpdated.cart;

                return done(null, userUpdated);
            } catch (error) {
                return done("Error al crear el usuario" + error);
            }
        }
    ));

    passport.use("login", new localStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (username, password, done) => {
            try {
                const user = await UserManager.getUser(username);
                if (user === null) {
                    return done(null, false, { message: "El Usuario no existe" });
                };
                if (!isValidPass(user.password, password)){
                    return done(null, false, { message: "El Usuario o contraseña incorrecto." })
                };
                return done(null, user)
            } catch (error){
                return done("Error de login de usuario" + error);
            }
        }
    ));
};

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (user, done) => {
    const userDeserialized = await UserManager.getUser(user.email);
    done(null, userDeserialized);
});

export default initializePassport;