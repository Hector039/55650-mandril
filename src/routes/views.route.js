import { Router } from "express";
import Products from "../dao/dbManagers/ProductManager.js";
import Messages from "../dao/dbManagers/MessagesManager.js";
import productsModel from "../dao/models/productModel.js";
import CartManager from "../dao/dbManagers/CartManager.js";

const router = Router();

const messagesManager = new Messages();
const productManager = new Products();
const cartManager = new CartManager();

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
        const cartExample = "65a57434d6d3c222f881cb0b"

        res.render("productDetail", {
            title: "Detalle de Producto",
            style: "styles.css",
            productById,
            cartExample,
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
            productos,
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
            messageLog,
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartManager.getCartById(cid);
        const cartProducts = cart.products;

        const isCartEmpty = cartProducts.length > 0 ? true : false;
        
        res.render("carts", {
            title: `Detalle del carrito`,
            style: "styles.css",
            cartProducts,
            isCartEmpty,
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

export default router;