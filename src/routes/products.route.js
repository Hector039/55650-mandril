import { Router } from "express";
import Products from "../dao/dbManagers/ProductManager.js";

const router = Router();

const productManager = new Products();

router.get("/", async (req, res) => {
    try {
        const temporalProducts = await productManager.getAllProducts();

        res.status(201).json({
            total: temporalProducts.length === 0 ? "No hay productos cargados" : "Lista de todos los productos",
            data: temporalProducts
        })

    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const productById = await productManager.getProductById(pid);

        res.status(201).json({
            msg: "Producto encontrado.",
            data: productById
        })

    } catch (error) {
        res.status(400).json({
            error: error.message,
        })
    }
});

router.post("/", async (req, res) => {
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

        res.status(201).json({
            msg: "Producto creado correctamente.",
            data: newProduct
        })

    } catch (error) {
        res.status(400).json({
            error: error.message,
        })
    }

})

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, stock, category, thumbnails, status } = req.body;

    try {

        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails,
            status
        };

        const response = await productManager.updateProduct(pid, newProduct);

        res.status(201).json({
            msg: "Producto modificado correctamente.",
            data: response
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
        })
    }
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        const response = await productManager.deleteProduct(pid);

        res.status(201).json({
            msg: "Producto eliminado correctamente.",
            data: response
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
        })
    }
});


export default router;