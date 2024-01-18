import { Router } from "express";
import Messages from "../dao/dbManagers/MessagesManager.js";

const router = Router();

const messagesManager = new Messages();

router.post("/", async (req, res) => {
    const { email, message } = req.body;

    try {

        if (message !== undefined) {

            const user = email;
            await messagesManager.saveMessage({
                user,
                message
            });

            const messageLog = await messagesManager.getAllMessages();

            req.io.emit("messages-log", { user: email, messages: messageLog });

            res.status(201).json({
                msg: "Mensajes guardados correctamente."
            });
            return;
        };

        res.status(201).json({
            msg: `${email} inició sesion.`
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
        })
    }
});

export default router;