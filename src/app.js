import express from "express";
import productsRouter from "./routes/products.route.js";
import cartsRouter from "./routes/carts.route.js";
import viewsRouter from "./routes/views.route.js";
import chatRouter from "./routes/chat.route.js";
import sessionsRouter from "./routes/sessions.route.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";//server para crear con HTTP
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

dotenv.config()
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const COOKIESECRET = process.env.USERCOOKIESECRET;

const app = express();
app.use(cookieParser(COOKIESECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: MongoStore.create({
        mongoUrl: DB_URL,
        ttl: 24 * 60 * 60 //1 día para expirar y borrar
    }),
    secret: COOKIESECRET,
    resave: false,
    saveUninitialized: true
}));


app.engine("handlebars", handlebars.engine());//instancio el motor que voy a usar
app.set("views", __dirname + "/views");//indico donde estarán las vistas
app.set("view engine", "handlebars");//indico que el motor que instancié es el que voy a usar

app.use(express.static(__dirname + "/public"));//indico estáticamente mi carpeta public



const httpServer = app.listen(PORT, () => {//instancio solo el server http
    console.log(`Servidor escuchando en http://localhost: ${PORT}`)
});

const environment = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("Base de datos conectada");
    }catch (error){
        console.log("Error en conexión a base de datos", error);
    }
};

environment();

//Estrategias de passport-local
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    req.io = io;
    next();
});

app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/chat", chatRouter);
app.use("/api/sessions", sessionsRouter);

const io = new Server(httpServer);//creo el socket server

io.on("connection", socket => {
    console.log("se conectó un nuevo cliente");

    socket.on("new-user", (email) => {
        socket.broadcast.emit("new-user-connected", email);
    });

});
