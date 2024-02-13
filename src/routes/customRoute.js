import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

export default class CustomRouter {
    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        this.router;
    }

    init() { }

    get(path, strategy, policies, ...callbacks) {
        this.router.get(path, this.passportCall(strategy), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    post(path, policies, ...callbacks) {
        this.router.post(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    put(path, strategy, policies, ...callbacks) {
        this.router.put(path, this.passportCall(strategy), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    delete(path, strategy, policies, ...callbacks) {
        this.router.delete(path, this.passportCall(strategy), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    passportCall = strategy => {
        return async (req, res, next) => {
            passport.authenticate(strategy, function (error, user, info) {
                if (error) return next(error);
                if (!user) {
                    return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
                }
                req.user = user;
                next();
            })(req, res, next);
        }
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                params[1].status(500).send(error);
            }
        })
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.send({ status: "Success", payload });
        res.sendUserError = userError => res.status(400).send({ status: "UserError", userError });
        res.sendServerError = serverError => res.status(500).send({ status: "ServerError", serverError });
        next();
    }

    handlePolicies = policies => (req, res, next) => {
        if (policies[0] === "PUBLIC") return next();
        let token = null;
        if (!req && !req.cookies) {
            return res.status(401).send({ status: "Error", error: "Unautorized" });
        }
        token = req.cookies["cookieToken"];
        let user = jwt.verify(token, process.env.USERCOOKIESECRET);
        if (!policies.includes(user.role.toUpperCase())) return res.status(403).send({ status: "Error", error: "El rol indicado no existe" });
        req.user = user;
        next();
    }

}