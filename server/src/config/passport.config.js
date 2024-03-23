import { cartsService, usersService } from "../services/factory.js";
import passport from "passport";
import getEnvironment from "./process.config.js";
import local from "passport-local";
import { createHash, isValidPass } from "../tools/utils.js";
import GitHubStrategy from "passport-github2";
import GoogleStrategy from "passport-google-oauth20";
import mailer from "../tools/mailer.js";

const env = getEnvironment();

const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("google", new GoogleStrategy(
        {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: env.GOOGLE_CALLBACK_URL,
            scope: ["profile email"]
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                const user = await usersService.getUser(profile.id);

                if (user === null) {

                    const userEmail = await usersService.getUser(profile._json.email);
                    if (userEmail) {
                        return cb(null, userEmail, { messages: "El Email asociado a ese Usuario ya existe." });
                    }

                    const newCart = await cartsService.saveCart();
                    const cart = newCart._id;

                    await usersService.saveUser({
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile._json?.email,
                        password: Math.random().toString(36).substring(7),
                        idgoogle: profile.id,
                        cart
                    });

                    const userUpdated = await usersService.getUser(profile.id);
                    userUpdated["photo"] = profile._json.picture;
                    userUpdated["userCart"] = newCart
                    const mailResult = await mailer({ mail: userUpdated.email, name: userUpdated.firstName }, "Bienvenido a nuestro e-commerce!")
                    
                    return cb(null, userUpdated, { messages: mailResult });
                }

                user["photo"] = profile._json.picture;
                const userCart = await cartsService.getCartById(user.cart);
                user["userCart"] = userCart
                return cb(null, user);

            } catch (error) {
                return cb(error, null)
            }
        }
    ));

    passport.use("github", new GitHubStrategy(
        {
            clientID: env.GH_CLIENT_ID,
            clientSecret: env.GH_CLIENT_SECRETS,
            callbackURL: env.GH_CALLBACK_URL,
            scope: ["user: email"]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await usersService.getUser(profile.id);

                if (user === null) {

                    const userEmail = await usersService.getUser(profile._json?.email);
                    if (userEmail) {
                        return done(null, userEmail, { messages: "El Email asociado a ese Usuario ya existe." });
                    }

                    const newCart = await cartsService.saveCart();
                    const cart = newCart._id;

                    await usersService.saveUser({
                        firstName: profile.displayName.split(" ")[0],
                        lastName: profile.displayName.split(" ")[1],
                        email: profile._json?.email,
                        password: Math.random().toString(36).substring(7),
                        idgithub: profile.id,
                        cart
                    });

                    const userUpdated = await usersService.getUser(profile?.id);
                    userUpdated["photo"] = profile._json.avatar_url;
                    userUpdated["userCart"] = newCart
                    const mailResult = await mailer({ mail: userUpdated.email, name: userUpdated.firstName }, "Bienvenido a nuestro e-commerce!")

                    return done(null, userUpdated, { messages: mailResult });
                }
                user["photo"] = profile._json.avatar_url;
                const userCart = await cartsService.getCartById(user.cart);
                user["userCart"] = userCart
                return done(null, user);
            } catch (error) {
                return done(error, null)
            }
        }
    ));

    passport.use("signin", new localStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            const { firstName, lastName, email } = req.body;
            try {
                const user = await usersService.getUser(email);
                if (user !== null) {
                    return done(null, false, { messages: "El Usuario ya existe." });
                };

                const newCart = await cartsService.saveCart();
                const cart = newCart._id;
                
                await usersService.saveUser({
                    firstName,
                    lastName,
                    email,
                    password: createHash(password),
                    cart
                });

                const userUpdated = await usersService.getUser(email);
                userUpdated["userCart"] = newCart
                const mailResult = await mailer({mail: email, name: firstName}, "Bienvenido a nuestro e-commerce!")
                return done(null, userUpdated, { messages: mailResult });
            } catch (error) {
                return done(error, null);
            }
        }
    ));

    passport.use("login", new localStrategy(
        { usernameField: "email" },
        async (usermail, password, done) => {
            try {
                const user = await usersService.getUser(usermail);
                if (user === null) {
                    return done(null, false, { messages: "El Usuario no existe." });
                };
                if (!isValidPass(password, user.password)) {
                    return done(null, false, { messages: "Usuario o contraseña incorrecto." });
                };
                const userCart = await cartsService.getCartById(user.cart);
                user["userCart"] = userCart
                return done(null, user)
            } catch (error) {
                return done(error, null);
            }
        }
    ));


    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (user, done) => {
        try {
            const userDeserialized = await usersService.getUser(user.id);
            done(null, userDeserialized);
        } catch (error) {
            done(error, null);
        }
    });
};



export default initializePassport;