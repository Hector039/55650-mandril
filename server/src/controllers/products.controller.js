import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";
import { generateProductErrorInfo } from "../tools/customErrors/info.js";

export default class ProductsController {
    constructor(service) {
        this.productsService = service;
    }

    param = async (req, res, next, pid) => {//param
        try {
            const productById = await this.productsService.getProductById(pid);
            if (productById === null) {
                req.product = null;
                CustomError.createError({
                    message: `Producto ID: ${pid} no encontrado.`,
                    cause: generateProductErrorInfo(null),
                    code: TErrors.NOT_FOUND,
                });
            }
            req.product = productById;
            next();
        } catch (error) {
            next(error);
        }
    }

    searchProducts = async (req, res, next) => {
        const { text } = req.params;
        try {
            let products = await this.productsService.searchProducts(text);
            res.status(200).send(products);
        } catch (error) {
            next(error)
        }
    }

    getProductsFs = async (req, res, next) => {
        const { limit, sort, category, page } = req.query;
        try {

            const options = {
                limit: limit === undefined ? 3 : parseInt(limit),
                sort: sort === undefined ? "todos" : sort,
                category: category === undefined ? "todos" : category
            }
            
            let allProducts = await this.productsService.getAllProducts();

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
            res.status(200).send({ user, payload });
        } catch (error) {
            next(error)
        }
    }

    getProductsPaginated = async (req, res, next) => {//get
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
            const report = await this.productsService.paginateProduct(find, options);
            res.status(200).send({
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
            next(error)
        }
    }

    getProductById = async (req, res, next) => {//get
        try {
            const productById = req.product;
            res.status(200).send(productById);
        } catch (error) {
            next(error)
        }
    }

    saveProduct = async (req, res, next) => {//post
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        try {
            if (!title || !description || !code || !price || !stock || !category) {
                CustomError.createError({
                    message: `Datos no recibidos o inválidos.`,
                    cause: generateProductErrorInfo({ title, description, code, price, stock, category, thumbnails }),
                    code: TErrors.INVALID_TYPES,
                });
            }

            const newProduct = await this.productsService.saveProduct({
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails
            });

            if (newProduct === "errorCode") {
                CustomError.createError({
                    message: `El código ${code} del producto ingresado ya existe.`,
                    cause: generateProductErrorInfo(null),
                    code: TErrors.CONFLICT,
                });
            }

            res.status(200).send(newProduct);
        } catch (error) {
            next(error)
        }
    }

    updateProduct = async (req, res, next) => {//put
        const { title, description, code, price, stock, category, thumbnails, status } = req.body;
        try {
            if (!title || !description || !code || !price || !stock || !category || !status) {
                CustomError.createError({
                    message: `Datos no recibidos o inválidos.`,
                    cause: generateProductErrorInfo({ title, description, code, price, stock, category, thumbnails, status }),
                    code: TErrors.INVALID_TYPES
                });
            }
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

            const response = await this.productsService.updateProduct(productId, newProduct);

            if (response === "errorCode") {
                CustomError.createError({
                    message: `El código ${code} del producto ingresado ya existe.`,
                    cause: generateProductErrorInfo({ title, description, code, price, stock, category, thumbnails, status }),
                    code: TErrors.CONFLICT
                });
            }
            res.status(200).send(response);
        } catch (error) {
            next(error)
        }
    }

    deleteProduct = async (req, res, next) => {
        try {
            const productId = req.product._id;
            await this.productsService.deleteProduct(productId);
            res.status(200).send();
        } catch (error) {
            next(error)
        }
    }

}