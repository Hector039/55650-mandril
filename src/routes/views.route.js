import { Router } from "express";
import Products from "../dao/dbManagers/ProductManager.js";
import Messages from "../dao/dbManagers/MessagesManager.js";

const router = Router();

const messagesManager = new Messages();

const productManager = new Products();


router.get("/", async (req, res) => {
    try {
        const productos = await productManager.getAllProducts();
        let esAdmin = "user";

        res.render("home", {
            name: "user",
            role: esAdmin === "user",
            title: "Productos",
            style: "styles.css",
            productos
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const productos = await productManager.getAllProducts();

        res.render("realTimeProducts", {
            title: "Productos",
            style: "styles.css",
            productos
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

router.get("/chat", async (req, res) => {
    try{
        const messageLog = await messagesManager.getAllMessages();

        res.render("chat", {
        title: "Chat",
        style: "styles.css",
        messageLog
    });

    }catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
    
});

export default router;