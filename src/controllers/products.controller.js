import { productsService } from "../repository/index.js";

async function param(req, res, next, pid) {//param
    try {
        const productById = await productsService.getProductById(pid);
        if (productById === null) {
            req.product = null;
            res.status(404).json({ error: "Producto inexistente." })
        }
        req.product = productById;
        next();
    } catch (error) { res.status(500).json({ error: error.message }) }
}

async function searchProducts(req, res) {
    const { text } = req.params;
    try {
        let products = await productsService.searchProducts(text);
        res.sendSuccess( products );
    } catch (error) {
        res.sendServerError(error);
    }
}

async function getProductsFs(req, res) {
    const { limit, sort, category, page } = req.query;
    try {
        const options = {
            limit: limit === undefined ? 2 : parseInt(limit),
            sort: sort === undefined ? "todos" : sort,
            category: category === undefined ? "todos" : category
        }

        let allProducts = await productsService.getAllProducts();

        if (options.category !== "todos") {
            let prodFilterCategory = allProducts.filter(product => product.category === options.category);
            allProducts = prodFilterCategory;
        }
        if (options.sort !== "todos") {
            allProducts.sort(function (a, b) {
                if (options.sort === "asc") {
                    return (a.price - b.price);
                } else if (options.sort === "desc") {
                    return (b.price - a.price);
                }
            });
        }
        let payload = allProducts.filter((data, index) => index < options.limit);
        const user = req.user
        res.sendSuccess(  {user, payload}  );
    } catch (error) {
        res.sendServerError(error);
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
        const report = await productsService.paginateProduct(find, options);
        res.sendSuccess({
            payload: report.docs,
            totalPages: report.totalPages,
            prevPage: report.prevPage,
            nextPage: report.nextPage,
            page: report.page,
            hasPrevPage: report.hasPrevPage,
            hasNextPage: report.hasNextPage,
            pagingCounter: report.pagingCounter,
            user: req.user
        });
    } catch (error) {
        res.sendServerError(error);
    }
}

async function getProductById(req, res) {//get
    try {
        const productById = req.product;
        res.sendSuccess(productById);
    } catch (error) {
        res.sendServerError(error);
    }
}

async function saveProduct(req, res) {//post
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    try {
        const newProduct = await productsService.saveProduct({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails
        });
        res.sendSuccess( newProduct );
    } catch (error) {
        res.sendServerError(error);
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
        const response = await productsService.updateProduct(productId, newProduct);
        res.sendSuccess( response );
    } catch (error) {
        res.sendServerError(error);
    }
}

async function deleteProduct(req, res) {
    try {
        const productId = req.product._id;
        await productsService.deleteProduct(productId);
        res.sendSuccess();
    } catch (error) {
        res.sendServerError(error);
    }
}

export { param, getProductsPaginated, getProductById, saveProduct, updateProduct, deleteProduct, getProductsFs, searchProducts };