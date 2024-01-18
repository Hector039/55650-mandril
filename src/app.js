import express from "express";
import productsRouter from "./routes/products.route.js";
import cartsRouter from "./routes/carts.route.js";
import viewsRouter from "./routes/views.route.js";
import chatRouter from "./routes/chat.route.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";//server para crear con HTTP
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine("handlebars", handlebars.engine());//instancio el motor que voy a usar
app.set("views", __dirname + "/views");//indico donde estarán las vistas
app.set("view engine", "handlebars");//indico que el motor que instancié es el que voy a usar

app.use(express.static(__dirname + "/public"));//indico estáticamente mi carpeta public

app.use(function (req, res, next) {
    req.io = io;
    next();
});

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/chat", chatRouter);

const httpServer = app.listen(PORT, () => {//instancio solo el server http
    console.log(`Servidor escuchando en http://localhost: ${PORT}`)
});

mongoose
    .connect(DB_URL)
    .then(() => {
        console.log("Base de datos conectada");
    })
    .catch((error) => {
        console.log("Error en conexión a base de datos", error);
    });

const io = new Server(httpServer);//creo el socket server

io.on("connection", socket => {
    console.log("se conectó un nuevo cliente");

    socket.on("new-user", (email) => {
        socket.broadcast.emit("new-user-connected", email);
    });

});
