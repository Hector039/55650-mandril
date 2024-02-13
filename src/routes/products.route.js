import { Router } from "express";
import Products from "../dao/dbManagers/ProductManager.js";

const router = Router();

const productManager = new Products();

router.param("pid", async (req, res, next, pid) => {
    try {
        const productById = await productManager.getProductById(pid);
        if (productById === null) {
            req.product = null;
            res.status(404).json({ error: "Producto inexistente." })
        }
        req.product = productById;
        next();
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
})

router.get("/", async (req, res) => {
    const { limit, sort, page, category } = req.query;

    try {

        let options = {
            limit: limit === undefined ? 10 : parseInt(limit),
            page: page === undefined ? 1 : parseInt(page),
        };

        if (sort !== undefined) {
            options["sort"] = { price: sort };
        };

        const find = category === undefined ? {} : { category: category };

        const report = await productManager.paginateProduct(find, options);

        res.status(201).json({
            status: "success",
            payload: report.docs,
            totalPages: report.totalPages,
            prevPage: report.prevPage,
            nextPage: report.nextPage,
            page: report.page,
            hasPrevPage: report.hasPrevPage,
            hasNextPage: report.hasNextPage,
            prevLink: report.hasPrevPage === false ? null : `/api/products?page=${report.prevPage}`,
            nextLink: report.hasNextPage === false ? null : `/api/products?page=${report.nextPage}`
        });

    } catch (error) {
        res.status(500).json({
            status: "Error",
            error: error.message
        })
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const productById = req.product;

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

        const prodUpdated = await productManager.getAllProducts();

        req.io.emit("updateList", prodUpdated)

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
    const { title, description, code, price, stock, category, thumbnails, status } = req.body;

    try {
        const productId = req.product._id;

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

        const response = await productManager.updateProduct(productId, newProduct);

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
    try {
        const productId = req.product._id;
        await productManager.deleteProduct(productId);

        const prodUpdated = await productManager.getAllProducts();

        req.io.emit("updateList", prodUpdated);

        res.status(201).json({
            msg: `Producto ID: ${productId} eliminado correctamente.`,
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
        })
    }
});

export default router;