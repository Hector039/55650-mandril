import passport from "passport";
import local from "passport-local";
import Users from "../dao/dbManagers/UserManager.js";
import CartManager from "../dao/dbManagers/CartManager.js";
import { createHash, isValidPass } from "../utils.js";
import GitHubStrategy from "passport-github2";
import GoogleStrategy from "passport-google-oauth20";
import jwt from "passport-jwt";

const GH_CLIENT_ID = process.env.GH_CLIENT_ID;
const GH_CLIENT_SECRETS = process.env.GH_CLIENT_SECRETS;
const GH_CALLBACK_URL = process.env.GH_CALLBACK_URL;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

const UserManager = new Users();
const cartManager = new CartManager();

const localStrategy = local.Strategy;
const JwtStrategy = jwt.Strategy;
//const extractJwt = jwt.ExtractJwt;

const cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["cookieToken"];
    }
    return token;
}

const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.USERCOOKIESECRET
}

const initializePassport = () => {

    passport.use("jwt", new JwtStrategy(options, async function (jwt_payload, done) {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }
    ))

    passport.use("google", new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
            scope: ["profile email"]
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                const user = await UserManager.getUser(profile.id);

                if (user === null) {

                    const userEmail = await UserManager.getUser(profile._json.email);
                    if (userEmail) {
                        return cb(null, false, { messages: "El Email asociado a ese Usuario ya existe." });
                    }

                    const newCart = await cartManager.saveCart();
                    const cart = newCart._id;

                    await UserManager.saveUser({
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile._json?.email,
                        password: Math.random().toString(36).substring(7),
                        idgoogle: profile.id,
                        cart
                    });

                    const userUpdated = await UserManager.getUser(profile.id);
                    userUpdated["photo"] = profile._json.picture;

                    return cb(null, userUpdated);
                }

                user["photo"] = profile._json.picture;
                return cb(null, user);

            } catch (error) {
                return cb(error, null)
            }
        }
    ));

    passport.use("github", new GitHubStrategy(
        {
            clientID: GH_CLIENT_ID,
            clientSecret: GH_CLIENT_SECRETS,
            callbackURL: GH_CALLBACK_URL,
            scope: ["user: email"]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await UserManager.getUser(profile.id);

                if (user === null) {

                    const userEmail = await UserManager.getUser(profile._json?.email);
                    if (userEmail) {
                        return done(null, false, { messages: "El Email asociado a ese Usuario ya existe." });
                    }

                    const newCart = await cartManager.saveCart();
                    const cart = newCart._id;

                    await UserManager.saveUser({
                        firstName: profile.displayName.split(" ")[0],
                        lastName: profile.displayName.split(" ")[1],
                        email: profile._json?.email,
                        password: Math.random().toString(36).substring(7),
                        idgithub: profile.id,
                        cart
                    });

                    const userUpdated = await UserManager.getUser(profile?.id);
                    userUpdated["photo"] = profile._json.avatar_url;

                    return done(null, userUpdated);
                }



                user["photo"] = profile._json.avatar_url;
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
                const user = await UserManager.getUser(email);
                if (user) {
                    return done(null, false, { messages: "El Usuario ya existe." });
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
                    return done(null, false, { messages: "El Usuario no existe." });
                };
                if (!isValidPass(user.password, password)) {
                    return done(null, false, { messages: "Usuario o contraseña incorrecto." });
                };
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
            const userDeserialized = await UserManager.getUser(user.id);
            done(null, userDeserialized);
        } catch (error) {
            done(error, null);
        }
    });
};



export default initializePassport;