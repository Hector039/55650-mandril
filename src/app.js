import loaders from "./loaders/index.js";
import express from "express";
import getEnvironment from "./config/process.config.js";
import { Server } from "socket.io";

async function startServer() {

    const env = getEnvironment();
    const app = express();

    await loaders(app);

    const httpServer = app.listen(env.PORT, err => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(`Servidor escuchando en puerto ${env.PORT} en modo ${env.MODE} y persistencia en ${env.PERSISTENCE}`);
    });

    const io = new Server(httpServer);

    io.on("connection", socket => {
        console.log("se conectó un nuevo cliente");
    
        socket.on("new-user", (email) => {
            socket.broadcast.emit("new-user-connected", email);
        });
    });
    
}

startServer();