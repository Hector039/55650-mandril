import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const router = Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
    const { limit } = req.query;
    try {
        const temporalProducts = await productManager.getProducts();

        if (limit) {
            const limitProducts = temporalProducts.filter((data, index) => index < limit);
            res.json({
                msg: "Lista de productos limitados con query",
                data: limitProducts,
                limit: limit,
                total: limitProducts.length === 0 ? "No hay productos cargados" : "Productos encontrados"
            });
        } else {
            res.json({
                total: temporalProducts.length === 0 ? "No hay productos cargados" : "Lista de todos los productos",
                data: temporalProducts
            })
        }

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const productById = await productManager.getProductById(parseInt(pid));

        if (productById) {
            res.json({
                msg: "Se encontró el producto",
                data: productById
            })
        } else {
            res.json({
                msg: "El producto no existe, intente con otro ID."
            })
        }

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

router.post("/", async (req, res) => {
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

        res.status(201).json({
            msg: "Producto creado correctamente.",
            data: newProduct
        })

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }

})

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const id = parseInt(pid)
    const { title, description, code, price, stock, category, thumbnails, status } = req.body;

    try {
        const productos = await productManager.getProducts();
        const productoIndice = productos.findIndex(product => product.id === parseInt(pid));

        if (!title || !description || !code || !price || !stock || !category || !status) {
            res.status(400).json({
                error: "Faltan datos"
            });
            return;
        }

        if (productoIndice === -1) {
            res.status(400).json({
                error: "No se encuentra el producto, intente con otro ID."
            })
            return;
        }

        const newProduct = {
            id,
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: [thumbnails],
            status
        };

        productos[productoIndice] = newProduct;

        await productManager.guardarProductos(productos);

        res.status(201).json({
            msg: "Producto modificado correctamente.",
            data: productos[productoIndice]
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

router.delete("/:pid", async (req, res) => {
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