import passport from "passport";
import local from "passport-local";
import Users from "../dao/dbManagers/UserManager.js";
import CartManager from "../dao/dbManagers/CartManager.js";
import { createHash, isValidPass } from "../utils.js";
import GitHubStrategy from "passport-github2";
import dotenv from "dotenv";
import GoogleStrategy from "passport-google-oauth20";

dotenv.config();
const GH_CLIENT_ID = process.env.GH_CLIENT_ID;
const GH_CLIENT_SECRETS = process.env.GH_CLIENT_SECRETS;
const GH_CALLBACK_URL = process.env.GH_CALLBACK_URL;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

const UserManager = new Users();
const cartManager = new CartManager();

const localStrategy = local.Strategy;

const initializePassport = () => {

    passport.use("google", new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                
                const user = await UserManager.getUser(profile?.email);

                if (user === null) {

                    const newCart = await cartManager.saveCart();
                    const cart = newCart._id;

                    await UserManager.saveUser({
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile?.email,
                        password: Math.random().toString(36).substring(7),
                        cart
                    });

                    const userUpdated = await UserManager.getUser(profile?.email);
                    return cb(null, userUpdated);
                } else {
                    return cb(null, user);
                }

            } catch (error) {
                return cb(error, null)
            }
        }
    ));

    passport.use("signin", new localStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            const { firstName, lastName, email } = req.body;
            try {
                const user = await UserManager.getUser(email);
                if (user) {
                    console.log("El Usuario ya existe.");
                    return done(null, false);
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
                return done(error, null);
            }
        }
    ));

    passport.use("login", new localStrategy(
        { usernameField: "email" },
        async (username, password, done) => {
            try {
                const user = await UserManager.getUser(username);
                if (user === null) {
                    console.log("El Usuario no existe.");
                    return done(null, false);
                };
                if (!isValidPass(user.password, password)) {
                    console.log("Usuario o contraseña incorrecto.");
                    return done(null, false);
                };
                return done(null, user)
            } catch (error) {
                return done(error, null);
            }
        }
    ));

    passport.use("github", new GitHubStrategy(
        {
            clientID: GH_CLIENT_ID,
            clientSecret: GH_CLIENT_SECRETS,
            callbackURL: GH_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {

                const user = await UserManager.getUser(profile?._json.email);

                if (user === null) {

                    const newCart = await cartManager.saveCart();
                    const cart = newCart._id;

                    await UserManager.saveUser({
                        firstName: profile?.displayName.split(" ")[0],
                        lastName: profile?.displayName.split(" ")[1],
                        email: profile?._json.email,
                        password: Math.random().toString(36).substring(7),
                        cart
                    });

                    const userUpdated = await UserManager.getUser(profile?._json.email);
                    return done(null, userUpdated);
                } else {
                    return done(null, user);
                }

            } catch (error) {
                return done(error, null)
            }

        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (user, done) => {
        try {
            const userDeserialized = await UserManager.getUser(user.email);
            done(null, userDeserialized);
        } catch (error) {
            done(error, null);
        }
    });
};



export default initializePassport;