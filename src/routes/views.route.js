import { Router } from "express";
import Products from "../dao/dbManagers/ProductManager.js";
import Messages from "../dao/dbManagers/MessagesManager.js";
import CartManager from "../dao/dbManagers/CartManager.js";
import { authorization, userPassJwt, isSessionOn } from "../utils.js";
import passport from "passport";

const router = Router();

const messagesManager = new Messages();
const productManager = new Products();
const cartManager = new CartManager();

router.get("/login", isSessionOn(), (req, res) => {
    res.render("login", {
        title: "Inicia sesión",
        style: "styles.css"
    });
});

router.get("/forgot", isSessionOn(), (req, res) => {
    res.render("forgot", {
        title: "Restaura tu contraseña",
        style: "styles.css"
    });
});

router.get("/signin", isSessionOn(), (req, res) => {
    res.render("signin", {
        title: "Crea tu cuenta",
        style: "styles.css"
    });
});

router.get("/logout", (req, res) => {
    res.clearCookie("cookieToken");

    res.render("logout", {
        title: "LogOut",
        style: "styles.css"
    });

});

router.get("/", userPassJwt(), async (req, res) => {
    let { pag, sortcategory, sortprice, lim } = req.query;
    try {

        let options = {
            limit: lim === undefined ? 2 : parseInt(lim),
            page: pag === undefined ? 1 : parseInt(pag),
            lean: true
        };

        let sortCategory = null;
        let sortPrice = null;

        if(sortprice === undefined || sortprice === "todos"){
            sortPrice = `&sortprice=todos`;
        } else {
            options["sort"] = { price: sortprice };
            sortPrice = `&sortprice=${sortprice}`;
        }

        if (sortcategory === undefined || sortcategory === "todos") {
            sortcategory = {};
            sortCategory = `&sortcategory=todos`;
        } else {
            sortcategory = { category: sortcategory };
            sortCategory = `&sortcategory=${sortcategory.category}`;
        }

        const report = await productManager.paginateProduct(sortcategory, options);

        let limA = "";
        let limB = "";
        let limC = "";
        if (lim === "2") {
            limA = "selected";
        } else if (lim === "5") {
            limB = "selected";
        } else if (lim === "10") {
            limC = "selected";
        }

        let priceA = "";
        let priceB = "";
        let priceC = "";
        if (sortprice === "todos" || sortprice === undefined) {
            priceA = "selected";
        } else if (sortprice === "asc") {
            priceB = "selected";
        } else if (sortprice === "desc") {
            priceC = "selected";
        }

        let catA = "";
        let catB = "";
        let catC = "";
        let catD = "";
        let catE = "";
        let catF = "";
        let catG = "";
        let catH = "";
        let catI = "";
        if (sortcategory.category === "todos") {
            catA = "selected";
        } else if (sortcategory.category === "muebles") {
            catB = "selected";
        } else if (sortcategory.category === "iluminación") {
            catC = "selected";
        } else if (sortcategory.category === "ropa de cama") {
            catD = "selected";
        } else if (sortcategory.category === "electrodomésticos") {
            catE = "selected";
        } else if (sortcategory.category === "cocina") {
            catF = "selected";
        } else if (sortcategory.category === "tecnología") {
            catG = "selected";
        } else if (sortcategory.category === "accesorios") {
            catH = "selected";
        } else if (sortcategory.category === "decoración") {
            catI = "selected";
        }

        const { docs, totalDocs, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, limit, page } = report;

        const showPaginate = totalPages <= 1 ? false : true;
        const isAdmin = req.user.role === "admin" ? true : false;
        const isAdminButton = req.user.role === "admin" ? false : true;
        const isLogIn = req.user.id === undefined ? false : true;
        const userPhoto = req.user.photo === undefined ? "../profilePhoto.png" : req.user.photo;
        const userName = req.user.name;

        res.render("home", {
            title: "Productos",
            style: "styles.css",
            limA, limB, limC, priceA, priceB, priceC,
            catA, catB, catC, catD, catE, catF, catG, catH, catI,
            sortCategory, sortPrice,
            userName,
            userPhoto,
            isLogIn,
            isAdmin,
            isAdminButton,
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

router.get("/productdetail/:pid", userPassJwt(), async (req, res) => {
    const { pid } = req.params;

    try {
        const isLogIn = req.user.id === undefined ? false : true;
        const isAdmin = req.user.role === "admin" ? false : true;
        let userCart = null;
        if (isLogIn && isAdmin) {
            userCart = req.user.cart._id;
        }
        const productById = await productManager.getProductById(pid);
        const cart = await cartManager.getCartById(userCart);

        res.render("productDetail", {
            title: "Detalle de Producto",
            style: "styles.css",
            productById,
            isLogIn,
            cart,
            isAdmin
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

router.get("/realtimeproducts", passport.authenticate("jwt"), authorization("admin"), async (req, res) => {
    try {
        const productos = await productManager.getAllProducts();

        res.render("realTimeProducts", {
            title: "Productos",
            style: "styles.css",
            user: req.user.name,
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

router.get("/carts", passport.authenticate("jwt"), async (req, res) => {
    try {

        const user = req.user.name;
        const userCartId = req.user.role === "admin" ? null : req.user.cart._id;
        const cart = await cartManager.getCartById(userCartId);
        const cartProducts = req.user.role === "admin" ? [] : cart.products;

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