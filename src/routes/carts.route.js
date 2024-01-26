import { Router } from "express";
import CartManager from "../dao/dbManagers/CartManager.js";
import Products from "../dao/dbManagers/ProductManager.js";

const router = Router();

const cartManager = new CartManager();
const productManager = new Products();

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.saveCart();

        res.status(201).json({
            msg: "Carrito creado correctamente.",
            data: newCart
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        const cartById = await cartManager.getCartById(cid);

        if (cartById === null) {
            res.status(400).json({
                error: `El carrito de ID: ${cid} no encontrado`,
            });
            return;
        };

        res.status(201).json({
            msg: `Se encontró el carrito de ID: ${cid}`,
            data: cartById
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

router.delete("/product/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        const userCart = req.session.cart;
        const productId = await productManager.getProductById(pid);
        const cart = await cartManager.getCartById(userCart);

        if (cart === null) {
            res.status(400).json({
                error: `El carrito de ID: ${userCart} no encontrado`,
            });
            return;
        };

        if (productId === null) {
            res.status(400).json({
                error: `El producto de ID: ${pid} no encontrado`,
            });
            return;
        };

        const productExistsInCart = cart.products.find(prod => prod.product._id == pid);

        if (productExistsInCart === undefined) {
            res.status(400).json({
                error: `El producto de ID: ${pid} no fué encontrado en el carrito ID: ${userCart}`,
            });
            return;
        }

        await cartManager.deleteProductToCart(userCart, productExistsInCart);
        const cartUpdated = await cartManager.getCartById(userCart);

        res.status(201).json({
            msg: `Se eliminó el producto ${pid} del carrito ${userCart}`,
            data: cartUpdated
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartManager.getCartById(cid);

        if (cart === null) {
            res.status(400).json({
                error: `El carrito de ID: ${cid} no encontrado`,
            });
            return;
        };

        await cartManager.deleteAllProducts(cid);

        const cartUpdated = await cartManager.getCartById(cid);

        res.status(201).json({
            msg: `Se eliminaron todos los productos del carrito ${cid}`,
            data: cartUpdated
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

router.put("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {

        const productId = await productManager.getProductById(pid);
        const cart = await cartManager.getCartById(cid);

        if (cart === null) {
            res.status(400).json({
                error: `El carrito de ID: ${cid} no encontrado`,
            });
            return;
        };

        if (productId === null) {
            res.status(400).json({
                error: `El producto de ID: ${pid} no encontrado`,
            });
            return;
        };

        const productExistsInCart = cart.products.find(prod => prod.product._id == pid);

        if (productExistsInCart === undefined) {
            res.status(400).json({
                error: `El producto de ID: ${pid} no fué encontrado en el carrito ID: ${cid}`,
            });
            return;
        }

        const modifiedCart = await cartManager.updateCart(cid, pid, quantity);

        res.status(201).json({
            msg: `Se actualizó la cantidad del producto ${pid} del carrito ${cid}`,
            data: modifiedCart
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

router.post("/addproduct/:pid", async (req, res) => {
    const { pid } = req.params;
    const { quantity } = req.body;


    try {
        const userCart = req.session.cart;
        const productId = await productManager.getProductById(pid);
        const cart = await cartManager.getCartById(userCart);

        if (cart === null) {
            res.status(400).json({
                error: `El carrito de ID: ${userCart} no encontrado`,
            });
            return;
        };

        if (productId === null) {
            res.status(400).json({
                error: `El producto de ID: ${pid} no encontrado`,
            });
            return;
        };

        await cartManager.addProductAndQuantityToCart(cart, pid, quantity);

        res.status(201).json({
            msg: `Se actualizó el producto ${pid} y cantidad ${quantity} al carrito ${userCart}`
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

export default router;

/* 
router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const productId = await productManager.getProductById(pid);
        const cart = await cartManager.getCartById(cid);

        if (cart === null) {
            res.status(400).json({
                error: `El carrito de ID: ${cid} no encontrado`,
            });
            return;
        }

        if (productId === null) {
            res.status(400).json({
                error: `El producto de ID: ${pid} no encontrado`,
            });
            return;
        }

        await cartManager.addProductToCart(cart, pid);
        const cartUpdated = await cartManager.getCartById(cid);

        const quantityProduct = cartUpdated.products.find(prod => prod.product._id == pid);

        res.status(201).json({
            msg: `Se sumó un producto ${pid} en el carrito ${cid}.`,
            data: cartUpdated,
            cantidad: quantityProduct.quantity
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});
 */