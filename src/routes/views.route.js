import { Router } from "express";
import Products from "../dao/dbManagers/ProductManager.js";
import Messages from "../dao/dbManagers/MessagesManager.js";
import CartManager from "../dao/dbManagers/CartManager.js";
import auth from "../middlewares/auth.js";

const router = Router();

const messagesManager = new Messages();
const productManager = new Products();
const cartManager = new CartManager();

router.get("/login", (req, res) => {
    res.render("login", {
        title: "Inicia sesión",
        style: "styles.css"
    });
});

router.get("/signin", (req, res) => {
    res.render("signin", {
        title: "Crea tu cuenta",
        style: "styles.css"
    });
});

router.get("/logout", (req, res) => {
    res.clearCookie('connect.sid');

    req.session.destroy(error => {
        if (error) {
            return res.json({
                status: "Error de LogOut",
                body: error
            });
        };

        res.render("logout", {
            title: "LogOut",
            style: "styles.css"
        });

    })
});

router.get("/home", async (req, res) => {
    const { lim, pag } = req.query;

    try {
        
        let options = {
            limit: lim === undefined ? 2 : parseInt(lim),
            page: pag === undefined ? 1 : parseInt(pag),
            lean: true
        };

        const report = await productManager.paginateProduct({}, options);

        const { docs, totalDocs, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, limit, page } = report;

        const showPaginate = totalPages <= 1 ? false : true;
        const isAdmin = req.session.role === "admin" ? true : false;
        const isLogIn = req.session.user === undefined ? false : true;

        res.render("home", {
            title: "Productos",
            style: "styles.css",
            user: req.session.user,
            isLogIn,
            isAdmin,
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
        const userCart = req.session.cart;
        const cart = await cartManager.getCartById(userCart);
        const isLogIn = req.session.user === undefined ? false : true;

        res.render("productDetail", {
            title: "Detalle de Producto",
            style: "styles.css",
            productById,
            isLogIn,
            cart
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

router.get("/realtimeproducts", auth, async (req, res) => {
    try {
        const productos = await productManager.getAllProducts();

        res.render("realTimeProducts", {
            title: "Productos",
            style: "styles.css",
            user: req.session.user,
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
            messageLog,
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

router.get("/carts", async (req, res) => {
    try {

        const user = req.session.user;
        const userCartId = req.session.cart._id;
        const cart = await cartManager.getCartById(userCartId);
        const cartProducts = cart.products;

        const isCartOccupied = cartProducts.length > 0 ? true : false;

        res.render("carts", {
            title: `Detalle del carrito`,
            style: "styles.css",
            user,
            userCartId,
            cartProducts,
            isCartOccupied,
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

export default router;