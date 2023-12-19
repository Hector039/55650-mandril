import express from "express";
import productsRouter from "./routes/products.route.js";
import cartsRouter from "./routes/carts.route.js";
import viewsRouter from "./routes/views.route.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";//server para crear con HTTP

const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine("handlebars", handlebars.engine());//instancio el motor que voy a usar
app.set("views", __dirname + "/views");//indico donde estarán las vistas
app.set("view engine", "handlebars");//indico que el motor que instancié es el que voy a usar

app.use(express.static(__dirname + "/public"));//indico estáticamente mi carpeta public

app.use(function(req, res, next) {
    req.io = io;
    next();
});

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const httpServer = app.listen(PORT, () => {//instancio solo el server http
    console.log(`Servidor escuchando en http://localhost: ${PORT}`)
});

const io = new Server(httpServer);//creo el socket server

io.on("connection", socket => {
    console.log("se conectó un nuevo cliente");

    socket.on("mensaje", datos => {//escucho el evento "mensaje" y muestro los datos enviados
        console.log(datos);
    });

});
