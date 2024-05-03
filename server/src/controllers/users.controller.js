import { generateToken, createHash, isValidPass } from "../tools/utils.js";
import getEnvironment from "../config/process.config.js";
import mailer from "../tools/mailer.js";
import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";
import { generateUserErrorInfo } from "../tools/customErrors/info.js";

const env = getEnvironment();

export default class UsersController {
    constructor(service) {
        this.usersService = service;
    }

    avatar = async (req, res, next) => {//post
        const avatar = req.file;
        const user = req.user;
        try {
            if (!avatar) {
                CustomError.createError({
                    message: "No se recibió ningún archivo.",
                    cause: generateUserErrorInfo(null),
                    code: TErrors.INVALID_TYPES,
                });
            }
            const avatarPath = `http://localhost:8080/${avatar.filename}`;
            await this.usersService.updateField(user.id, "avatar", avatarPath);
            res.status(200).send({ message: "Nueva foto de perfil recibida!", avatar: avatarPath })
        } catch (error) {
            next(error)
        }
    }

    docs = async (req, res, next) => {//post
        const idDoc = req.files.idDoc !== undefined ? req.files.idDoc[0] : undefined;
        const adressDoc = req.files.adressDoc !== undefined ? req.files.adressDoc[0] : undefined;
        const accountDoc = req.files.accountDoc !== undefined ? req.files.accountDoc[0] : undefined;
        const user = req.user;
        try {
            if (!idDoc && !adressDoc && !accountDoc) {
                CustomError.createError({
                    message: "No se recibió ningún archivo.",
                    cause: generateUserErrorInfo(null),
                    code: TErrors.INVALID_TYPES,
                });
            }
            if (idDoc) await this.usersService.updateField(user.id, "documents", { name: idDoc.fieldname, reference: idDoc.destination });
            if (adressDoc) await this.usersService.updateField(user.id, "documents", { name: adressDoc.fieldname, reference: adressDoc.destination });
            if (accountDoc) await this.usersService.updateField(user.id, "documents", { name: accountDoc.fieldname, reference: accountDoc.destination });
            res.status(200).send(`Documento/s recibido/s!`)
        } catch (error) {
            next(error)
        }
    }

    userLogin = async (req, res, next) => {//post
        try {
            const email = req.user.email;
            const role = req.user.role;
            const avatar = req.user.avatar;
            const cart = req.user.userCart;
            const cartId = typeof req.user.cart === "object" ? req.user.cart._id : req.user.cart;
            const name = req.user.firstName;
            const lastName = req.user.lastName;
            const id = req.user._id;
            const lastConnection = req.user.last_connection;
            const documents = req.user.documents;
            const docs = ["idDoc", "adressDoc", "accountDoc"];
            const isAllDocs = docs.filter(doc => {
                const docsExists = documents.find(e => e.name === doc)
                if (!docsExists) return true;
            });
            let token = generateToken({ email, role, cart, name, id, cartId, lastConnection, lastName, isAllDocs, avatar, documents });
            res.cookie("cookieToken", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
                secure: env.USERCOOKIESECRET
            }).status(200).send({ email, role, cart, name, id, cartId, lastConnection, isAllDocs, lastName, avatar, documents });
        } catch (error) {
            next(error)
        }
    }

    userSignIn = async (req, res, next) => {//post
        const email = req.user
        try {
            res.status(200).send(`Bienvenido!. Para finalizar el registro valida tu usuario con el link que te enviamos a ${email}.`)
        } catch (error) {
            next(error)
        }
    }

    premiumSelector = async (req, res, next) => {//put
        const { email } = req.params;
        try {
            const user = await this.usersService.getUser(email);
            if (user === null) {
                CustomError.createError({
                    message: "Usuario no encontrado.",
                    cause: generateUserErrorInfo(email),
                    code: TErrors.INVALID_TYPES,
                });
            }
            const docs = ["idDoc", "adressDoc", "accountDoc"];
            const isAllDocs = user.documents.filter(doc => docs.includes(doc.name));
            if (isAllDocs.length < 3 && user.role === "user") {
                CustomError.createError({
                    message: "Para ser PREMIUM debes presentar todos los documentos en la sección Mi Cuenta.",
                    cause: generateUserErrorInfo(null),
                    code: TErrors.INVALID_TYPES,
                });
            }
            if (user.role === "user") await this.usersService.premiumSelector(email, "premium");
            else await this.usersService.premiumSelector(email, "user");
            const userUpdated = await this.usersService.getUser(email);
            res.status(200).send({ message: `Felicitaciones!. Ahora eres ${userUpdated.role}.`, userNewRole: userUpdated.role })
        } catch (error) {
            next(error)
        }
    }

    userVerified = async (req, res, next) => {//post
        try {
            const { email } = req.params;
            await this.usersService.userVerification(email);
            const user = await this.usersService.getUser(email);
            const role = user.role;
            const cart = user.userCart;
            const cartId = typeof user.cart === "object" ? user.cart._id : user.cart;
            const name = user.firstName;
            const id = user._id;
            let token = generateToken({ email, role, cart, name, id, cartId });
            res.cookie("cookieToken", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
                secure: env.USERCOOKIESECRET
            }).redirect("http://localhost:5173/");
        } catch (error) {
            next(error)
        }
    }

    passRestoration = async (req, res, next) => {
        try {
            const { email } = req.params;
            const user = await this.usersService.getUser(email);
            if (user === null) {
                CustomError.createError({
                    name: "Error restaurando contraseña",
                    message: "Usuario no encontrado.",
                    cause: generateUserErrorInfo(email),
                    code: TErrors.INVALID_TYPES,
                });
            }
            //await mailer({ mail: email, name: user.firstName },
            //`Haz click en el enlace para restaurar tu contraseña: <a href="http://localhost:5173/forgot/${email}">Restaurar</a>`)
            res.cookie("tempCookie", "temporalCookie", { maxAge: 1000 * 60 * 60 }).status(200).send(`Se envió la solicitud de restauración a ${email}`);
        } catch (error) {
            next(error)
        }
    }

    userForgotPass = async (req, res, next) => {//post
        const { email, password } = req.body;
        const cookie = req.cookies.tempCookie;
        try {
            if (!cookie) {
                CustomError.createError({
                    name: "Error restaurando contraseña",
                    message: "Expiró el tiempo de restauración. Intenta de nuevo.",
                    cause: generateUserErrorInfo(cookie),
                    code: TErrors.ROUTING,
                });
            }
            const user = await this.usersService.getUser(email);
            if (user === null) {
                CustomError.createError({
                    name: "Error restaurando contraseña",
                    message: "Usuario no encontrado.",
                    cause: generateUserErrorInfo(req.body),
                    code: TErrors.INVALID_TYPES,
                });
            }
            if (password.length < 3) {
                CustomError.createError({
                    name: "Error restaurando contraseña",
                    message: "Contraseña inválida",
                    cause: generateUserErrorInfo(req.body),
                    code: TErrors.INVALID_TYPES,
                });
            }
            if (isValidPass(password, user.password)) {
                CustomError.createError({
                    name: "Error restaurando contraseña",
                    message: "La contraseña debe ser diferente a la anterior.",
                    cause: generateUserErrorInfo(req.body),
                    code: TErrors.INVALID_TYPES,
                });
            }
            await this.usersService.updateUser(email, createHash(password));
            //await mailer({ mail: email, name: user.firstName }, "Se cambió tu contraseña.")
            res.status(200).send("Se cambió la contraseña correctamente.");
        } catch (error) {
            next(error)
        }
    }

    userLogout = async (req, res) => {
        res.clearCookie('cookieToken');
        return res.status(200).send("Usuario deslogueado!");
    }

    gitHub = async (req, res) => { };//get

    gitHubStrategy = async (req, res) => {//get
        const email = req.user.email;
        const role = req.user.role;
        const avatar = req.user.avatar;
        const lastName = req.user.lastName;
        const cart = req.user.userCart;
        const cartId = typeof req.user.cart === "object" ? req.user.cart._id : req.user.cart;
        const name = req.user.firstName;
        const id = req.user._id;
        const photo = req.user.photo;
        const lastConnection = req.user.last_connection;
        const documents = req.user.documents;
        const docs = ["idDoc", "adressDoc", "accountDoc"];
        const isAllDocs = docs.filter(doc => {
            const docsExists = documents.find(e => e.name === doc)
            if (!docsExists) return true;
        });
        let token = generateToken({ email, role, cart, name, id, cartId, lastConnection, lastName, isAllDocs, avatar, documents, photo });
        res.cookie("cookieToken", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            secure: env.USERCOOKIESECRET
        }).redirect("http://localhost:5173/");
    }

    google = async (req, res) => { };//get

    googleStrategy = async (req, res) => {//get
        const email = req.user.email;
        const role = req.user.role;
        const avatar = req.user.avatar;
        const lastName = req.user.lastName;
        const cart = req.user.userCart;
        const cartId = typeof req.user.cart === "object" ? req.user.cart._id : req.user.cart;
        const name = req.user.firstName;
        const id = req.user._id;
        const photo = req.user.photo;
        const lastConnection = req.user.last_connection;
        const documents = req.user.documents;
        const docs = ["idDoc", "adressDoc", "accountDoc"];
        const isAllDocs = docs.filter(doc => {
            const docsExists = documents.find(e => e.name === doc)
            if (!docsExists) return true;
        });
        let token = generateToken({ email, role, cart, name, id, cartId, lastConnection, lastName, isAllDocs, avatar, documents, photo });
        res.cookie("cookieToken", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            secure: env.USERCOOKIESECRET
        }).redirect("http://localhost:5173/");
    }
}

