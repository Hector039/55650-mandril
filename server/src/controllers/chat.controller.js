import { chatsService } from "../repository/index.js";
import { socketIO } from "../app.js";
console.log(socketIO);
    let users = []

    async function saveMessage(email, message) {
        await chatsService.saveMessage(email, message)
        return
    }
    async function getUserMessages(email) {
        const messageLog = await chatsService.getUserMessages(email)
        return messageLog
    }


    socketIO.on('connection', (socket) => {
        console.log(`${socket.id} user just connected!`);

        socket.on('message', (data) => {
            console.log(data);
            saveMessage(data.email, data.text)
            socketIO.emit('messageResponse', data);
        });

        //Listens when a new user joins the server
        socket.on('newUser', (data) => {
            let messageLog = getUserMessages(data.userEmail)
            if(!messageLog) return messageLog = []
            socketIO.emit('messageResponse', messageLog);
            //Adds the new user to the list of users
            users.push(data);
            // console.log(users);
            //Sends the list of users to the client
            socketIO.emit('newUserResponse', users);
        });

        socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

        socket.on('disconnect', () => {
            console.log('A user disconnected');
            users = users.filter((user) => user.socketID !== socket.id);
            // console.log(users);
            //Sends the list of users to the client
            socketIO.emit('newUserResponse', users);
            socket.disconnect();
        });
    });



/* 
async function chatWithAdmin(req, res) {//post
    const { user, message } = req.body;
    try {
    if(!user || !message) return res.sendUserError("Faltan datos de ususario o no se recibió el mensaje.");
        const email = user.email
        const userRole = user.role
        await chatsService.saveMessage({email, message})
        const messageLog = await chatsService.getUserMessages(email)
        req.io.emit("messages-log", { user: email, messages: messageLog, role: userRole });
        res.sendSuccess()
    } catch (error) {
        res.sendServerError(error);
    }
}

export { chatWithAdmin } */