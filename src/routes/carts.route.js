import { Router } from "express";
import { CartManager } from "../CartManager.js";
import { ProductManager } from "../ProductManager.js";

const router = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();

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
        const cartById = await cartManager.getCartById(parseInt(cid));

        if (cartById) {
            const temporalProducts = await productManager.getProducts();

            const cartProducts = cartById.productos.map((prod) => {
                return {
                    product: temporalProducts.find((producto) => producto.id === prod.product),
                    quantity: prod.quantity,
                };
            });

            res.status(201).json({
                msg: `Se encontró el carrito de ID: ${cid}`,
                data: cartProducts
            });
            return;
        }

        res.status(404).json({
            msg: "El carrito no existe, intente con otro ID."
        })

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const temporalProducts = await productManager.getProducts();
        const productIndex = temporalProducts.findIndex((product) => product.id === parseInt(pid));

        const carts = await cartManager.getCarts();
        const cartIndex = carts.findIndex((cart) => cart.id === parseInt(cid));

        if (cartIndex < 0) {
            res.status(404).json({
                msg: `El carrito ${cid} no existe, intente con otro ID.`
            });
            return;
        }

        if (productIndex < 0) {
            res.status(404).json({
                msg: `El producto ${pid} no existe, intente con otro ID.`
            });
            return;
        }

        const cartProducts = await cartManager.addProductToCart(cid, pid);

        res.status(201).json({
            msg: `Se sumó un producto ${pid} en el carrito ${cid}.`,
            data: cartProducts
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

export default router;