import { Router } from "express";
import Products from "../dao/dbManagers/ProductManager.js";
import Messages from "../dao/dbManagers/MessagesManager.js";
import productsModel from "../dao/models/productModel.js";

const router = Router();

const messagesManager = new Messages();

const productManager = new Products();


router.get("/", async (req, res) => {
    const { lim, pag } = req.query;

    try {

        let options = {
            limit: lim === undefined ? 2 : parseInt(lim),
            page: pag === undefined ? 1 : parseInt(pag),
            lean: true
        };

        const report = await productsModel.paginate({}, options);
        
        const { docs, totalDocs, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, limit, page } = report;

        const showPaginate = totalPages <= 1 ? false : true;

        res.render("home", {
            title: "Productos",
            style: "styles.css",
            docs,
            totalDocs, 
            limit, 
            showPaginate, 
            page, 
            totalPages,
            hasPrevPage, 
            hasNextPage, 
            nextPage, 
            prevPage
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

router.get("/productdetail/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        const productById = await productManager.getProductById(pid);

        res.render("productDetail", {
            title: "Detalle de Producto",
            style: "styles.css",
            productById
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
    try {
        const messageLog = await messagesManager.getAllMessages();

        res.render("chat", {
            title: "Chat",
            style: "styles.css",
            messageLog
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }

});

export default router;