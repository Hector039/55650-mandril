import express from "express";
import indexRoute from "../routes/index.route.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "../config/passport.config.js";
import getEnvironment from "../config/process.config.js";
import __dirname from "../tools/utils.js";
import cors from "cors";
import session from "express-session";

const env = getEnvironment();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

export default async function appLoader(app) {
    app.use(cookieParser(env.USERCOOKIESECRET));
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(session({
        secret: env.USERCOOKIESECRET,
        resave: false,
        saveUninitialized: true
    }));

    initializePassport();
    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/", indexRoute);
    /* 
    app.use(function (req, res, next) {
        req.io = io;
        next();
    });
 */
    app.use(express.static(__dirname + "/public"));

    return app;
}