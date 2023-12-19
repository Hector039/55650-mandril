import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const productManager = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
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
        const productos = await productManager.getProducts();

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

    const productos = await productManager.getProducts();
    const codeExistente = productos.some(product => product.code === code);

    try {
        if (!title || !description || !code || !price || !stock || !category) {
            res.status(400).json({
                error: "Faltan datos"
            });
            return;
        }

        if (codeExistente) {
            res.status(400).json({
                error: "Código existente, intente con otro código."
            });
            return;
        }

        const newProduct = await productManager.addProduct(
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails
        );

        const prodUpdated = await productManager.getProducts();

        req.io.emit("updateList", prodUpdated)

        res.status(201).json({
            msg: "Producto creado correctamente.",
            data: newProduct
        });

        

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }

});

router.delete("/realtimeproducts/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        const productos = await productManager.getProducts();
        const productoIndice = productos.findIndex(product => product.id === parseInt(pid));

        if (productoIndice === -1) {
            res.status(400).json({
                error: "No se encuentra el producto, intente con otro ID."
            });
            return;
        };

        productos.splice(productoIndice, 1);

        await productManager.guardarProductos(productos);

        const prodUpdated = await productManager.getProducts();

        req.io.emit("updateList", prodUpdated)

        res.status(201).json({
            msg: "Producto eliminado correctamente.",
            data: productos[productoIndice]
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});


export default router;