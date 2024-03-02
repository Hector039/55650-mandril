import { productsDao } from "../dao/index.js";

async function param(req, res, next, pid) {//param
    try {
        const productById = await productsDao.getProductById(pid);
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
}

async function searchProductsFs(req, res) {
    const { text } = req.params;
    try {
        
        let products = await productsDao.searchProductsFs(text);

        res.status(201).json({
            msg: "Lista de todos los productos encontrados por título",
            data: products
        })

    } catch (error) {
        res.status(500).json({
            status: "Error",
            error: error.message
        })
    }
}

async function searchProducts(req, res) {
    const { text } = req.body;
    try {
        
        let products = await productsDao.searchProducts(text);

        res.status(201).json({
            msg: "Lista de todos los productos encontrados por título",
            data: products
        })

    } catch (error) {
        res.status(500).json({
            status: "Error",
            error: error.message
        })
    }
}

async function getProductsFs(req, res) {
    const { limit, sort, category, page } = req.query;
    const user = req.user;
    try {
        const options = {
            limit: limit === undefined ? 2 : parseInt(limit),
            sort: sort === undefined ? "todos" : sort,
            category: category === undefined ? "todos" : category
        }

        let allProducts = await productsDao.getAllProducts();

        if (options.category !== "todos") {
            let prodFilterCategory = allProducts.filter(product => product.category === options.category);
            allProducts = prodFilterCategory;
        }
        if (options.sort !== "todos") {
            allProducts.sort(function (a, b) {
                if (options.sort === "desc") {
                    return (a.price - b.price);
                } else if (options.sort === "asc") {
                    return (b.price - a.price);
                }
            });
        }
        
        let payload = allProducts.filter((data, index) => index < options.limit);

        res.status(201).json({
            msg: "Lista de todos los productos",
            payload,
            user: user
        })

    } catch (error) {
        res.status(500).json({
            status: "Error",
            error: error.message
        })
    }
}

async function getProductsPaginated(req, res) {//get
    const { limit, sort, page, category } = req.query;

    try {

        let options = {
            limit: parseInt(limit),
            page: page === undefined ? 1 : parseInt(page),
        };

        if (sort !== "todos") {
            options["sort"] = { price: sort };
        };

        const find = category === "todos" ? {} : { category: category };

        const report = await productsDao.paginateProduct(find, options);

        res.status(201).json({
            status: "success",
            payload: report.docs,
            totalPages: report.totalPages,
            prevPage: report.prevPage,
            nextPage: report.nextPage,
            page: report.page,
            hasPrevPage: report.hasPrevPage,
            hasNextPage: report.hasNextPage,
            pagingCounter: report.pagingCounter,
            user: req.user
            //prevLink: report.hasPrevPage === false ? null : `/api/products?page=${report.prevPage}`,
            //nextLink: report.hasNextPage === false ? null : `/api/products?page=${report.nextPage}`
        });

    } catch (error) {
        res.status(500).json({
            status: "Error",
            error: error.message
        })
    }
}

async function getProductById(req, res) {//get
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
}

async function saveProduct(req, res) {//post
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    try {

        const newProduct = await productsDao.saveProduct({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails
        });

        const prodUpdated = await productsDao.getAllProducts();

        //req.io.emit("updateList", prodUpdated);

        res.status(201).json({
            msg: "Producto creado correctamente.",
            data: newProduct
        })

    } catch (error) {
        res.status(400).json({
            error: error.message,
        })
    }
}

async function updateProduct(req, res) {//put
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

        const response = await productsDao.updateProduct(productId, newProduct);

        res.status(201).json({
            msg: "Producto modificado correctamente.",
            data: response
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
        })
    }
}

async function deleteProduct(req, res) {
    try {
        const productId = req.product._id;
        await productsDao.deleteProduct(productId);

        const prodUpdated = await productsDao.getAllProducts();

        //req.io.emit("updateList", prodUpdated);

        res.status(201).json({
            msg: `Producto ID: ${productId} eliminado correctamente.`,
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
        })
    }
}

export { param, getProductsPaginated, getProductById, saveProduct, updateProduct, deleteProduct, getProductsFs, searchProducts, searchProductsFs };