import loaders from "./loaders/index.js";
import express from "express";
import getEnvironment from "./config/process.config.js";
import { Server } from "socket.io";
//import { chatsService } from "./repository/index.js";



/* async function saveMessage(email, message) {
    await chatsService.saveMessage(email, message)
    return
}
async function getAllUserMessages(email) {
    const messageLog = await chatsService.getUserMessages(email)
    return messageLog
} */


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

const socketIO = new Server(httpServer, { cors: { origin: "http://localhost:5173" } });

let users = []
socketIO.on('connection', (socket) => {
    console.log(`Se conectó un nuevo cliente: ${socket.id}`);

    
    socket.on('message', (data) => {

        /* saveMessage(data.email, data.message).then(res => {
            getAllUserMessages(data.email).then(result => {
            if (!result) return result = []
            socketIO.emit('messageResponse', result);
        })
        }) */
        console.log(data);
        socketIO.emit('messageResponse', data);
    });

    socket.on('newUser', (data) => {
        /* data["socketID"] = socket.id
        getAllUserMessages(data.email).then(result => {
            if (!result) return result = []
            socketIO.emit('firstLoad', result);
        }) */
        data["socketID"] = socket.id
        users.push(data);
        socketIO.emit('newUserResponse', users);
    });

    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

    socket.on('leaveChat', () => {
        console.log('A user disconnected');
        users = users.filter((user) => user.socketID !== socket.id);
        socketIO.emit('newUserResponse', users);
        socket.disconnect();
    });
});
