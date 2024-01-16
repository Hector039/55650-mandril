import { Router } from "express";
import Products from "../dao/dbManagers/ProductManager.js";
import Messages from "../dao/dbManagers/MessagesManager.js";

const productManager = new Products();
const messagesManager = new Messages();

const router = Router();

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

router.post("/realtimeproducts", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    try {

        const newProduct = await productManager.saveProduct({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails
        });

        const prodUpdated = await productManager.getAllProducts();

        req.io.emit("updateList", prodUpdated)

        res.status(201).json({
            msg: "Producto creado correctamente.",
            data: newProduct
        });



    } catch (error) {
        res.status(400).json({
            error: error.message,
        })
    }

});

router.delete("/realtimeproducts/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        await productManager.deleteProduct(pid);

        const prodUpdated = await productManager.getAllProducts();

        req.io.emit("updateList", prodUpdated);

        res.status(201).json({
            msg: `Producto ID: ${pid} eliminado correctamente.`,
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
        })
    }
});

//////Chat con webSockets
router.get("/chat", (req, res) => {

    res.render("chat", {
        title: "Chat",
        style: "styles.css"
    });

});

router.post("/chat", async (req, res) => {
    const { email, message } = req.body;

    try {

        if (message !== undefined) {

            const user = email;
            await messagesManager.saveMessage({
                user,
                message
            });

            const messageLog = await messagesManager.getAllMessages();

            req.io.emit("messages-log", messageLog);

            res.status(201).json({
                msg: "Mensajes guardados correctamente."
            });
            return;
        }

        const messageLog = await messagesManager.getAllMessages();

        req.io.emit("new-user", { user: email, messages: messageLog });

        req.io.broadcast.emit("new-user-connected", {
            message: `Se ha conectado un nuevo usuario:`,
            user: email,
        });

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