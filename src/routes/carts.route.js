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

        res.status(201).json({
            msg: `Se encontró el carrito de ID: ${cid}`,
            data: cartById
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        const cartById = await cartManager.deleteCart(cid);

        res.status(201).json({
            msg: `Se eliminó el carrito de ID: ${cid}`,
            data: cartById
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
}); 

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const productId = await productManager.getProductById(pid);
        const cart = await cartManager.getCartById(cid);

        if(!cart){
            res.status(400).json({
                error: `El carrito de ID: ${cid} no encontrado`,
            });
            return;
        }

        if(!productId){
            res.status(400).json({
                error: `El producto de ID: ${pid} no encontrado`,
            });
            return;
        }

        await cartManager.addProductToCart(cart, pid);
        const cartUpdated = await cartManager.getCartById(cid);
        const quantityProduct = cartUpdated.products.find((producto) => producto.product === pid)

        res.status(201).json({
            msg: `Se sumó un producto ${pid} en el carrito ${cid}.`,
            data: cartUpdated,
            producto: productId,
            cantidad: quantityProduct.quantity
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

export default router;