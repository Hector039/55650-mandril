import { cartsService, productsService } from "../repository/index.js";
import mailer from "../tools/mailer.js";
import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";
import { generateProductErrorInfo, generateCartErrorInfo } from "../tools/customErrors/info.js";


async function getCart(req, res, next) {//get
    const { cid } = req.params;
    try {
        const cartById = await cartsService.getCartById(cid);
        if (cartById === null) {
            CustomError.createError({
                cause: generateCartErrorInfo(),
                message: `Carrito ID: ${cid} no encontrado.`,
                code: TErrors.NOT_FOUND
            });
        };
        res.status(200).send(cartById);
    } catch (error) {
        next(error)
    }
}

async function deleteProductToCart(req, res, next) {//delete
    const { pid } = req.params;
    try {
        const productId = await productsService.getProductById(pid);
        const cart = await cartsService.getCartById(req.user.cartId);
        if (cart === null) {
            CustomError.createError({
                message: `Carrito ID: ${req.user.cartId} no encontrado.`,
                cause: generateCartErrorInfo(),
                code: TErrors.NOT_FOUND,
            });
        }

        if (productId === null) {
            CustomError.createError({
                message: `Producto ID: ${pid} no encontrado.`,
                cause: generateProductErrorInfo(productId),
                code: TErrors.NOT_FOUND,
            });
        }

        const productExistsInCart = cart.products === undefined ? cart.find(prod => prod.product._id === parseInt(pid)) : cart.products.find(prod => prod.product._id == pid);

        if (productExistsInCart === undefined) {
            CustomError.createError({
                message: `Producto ID:${pid} inexistente en el carrito.`,
                cause: generateCartErrorInfo(),
                code: TErrors.NOT_FOUND,
            });
        }

        await cartsService.deleteProductToCart(req.user.cartId, productExistsInCart);
        const cartUpdated = await cartsService.getCartById(req.user.cartId);
        res.status(200).send(cartUpdated);
    } catch (error) {
        next(error)
    }
}

async function deleteAllProducts(req, res, next) {//delete
    const { cid } = req.params;
    try {
        const cart = await cartsService.getCartById(cid);
        if (cart === null) {
            CustomError.createError({
                message: `Carrito ID: ${cid} no encontrado.`,
                cause: generateCartErrorInfo(),
                code: TErrors.NOT_FOUND,
            });
        }
        const cartUpdated = await cartsService.deleteAllProducts(cid);
        res.status(200).send(cartUpdated);
    } catch (error) {
        next(error)
    }
}

async function updateCart(req, res, next) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        if (!quantity){
            CustomError.createError({
                message: `No se recibió cantidad.`,
                cause: generateCartErrorInfo(),
                code: TErrors.INVALID_TYPES,
            });
        }

        const cart = await cartsService.getCartById(cid);

        if (cart === null) {
            CustomError.createError({
                message: `Carrito ID: ${cid} no encontrado.`,
                cause: generateCartErrorInfo(),
                code: TErrors.NOT_FOUND,
            });
        }

        const productId = await productsService.getProductById(pid);

        if (productId === null) {
            CustomError.createError({
                message: `Producto ID: ${pid} no encontrado.`,
                cause: generateProductErrorInfo(null),
                code: TErrors.NOT_FOUND,
            });
        }

        const productInCart = cart.products.find(prod => prod.product._id == pid);

        if (productInCart === undefined) {
            CustomError.createError({
                message: `Producto ID: ${pid} inexistente en el carrito.`,
                cause: generateCartErrorInfo(),
                code: TErrors.NOT_FOUND,
            });
        }

        const modifiedCart = await cartsService.addProductAndQuantityToCart(cid, pid, quantity);
        res.status(200).send(modifiedCart);
    } catch (error) {
        next(error)
    }
}

async function addProductAndQuantity(req, res, next) {
    const { pid } = req.params;
    const { quantity } = req.body;
    try {
        if (!quantity){
            CustomError.createError({
                message: `No se recibió cantidad.`,
                cause: generateCartErrorInfo(),
                code: TErrors.INVALID_TYPES,
            });
        }

        const userCart = req.user.cartId;
        const cart = await cartsService.getCartById(userCart);
        
        if (cart === null) {
            CustomError.createError({
                message: `Carrito ID: ${cid} no encontrado.`,
                cause: generateCartErrorInfo(),
                code: TErrors.NOT_FOUND,
            });
        }
        
        const productId = await productsService.getProductById(pid);

        if (productId === null) {
            CustomError.createError({
                message: `Producto ID: ${pid} no encontrado.`,
                cause: generateProductErrorInfo(null),
                code: TErrors.NOT_FOUND,
            });
        }

        const updatedCart = await cartsService.addProductAndQuantityToCart(userCart, pid, quantity);
        res.status(200).send(updatedCart);
    } catch (error) {
        next(error)
    }
}

async function purchaseCart(req, res, next) {
    const { cid } = req.params;
    const { purchaseDatetime } = req.body;
    try {
        if (!purchaseDatetime){
            CustomError.createError({
                message: `No se recibió fecha de compra.`,
                cause: generateCartErrorInfo(),
                code: TErrors.INVALID_TYPES,
            });
        }
        const purchaserEmail = req.user.email
        const userName = req.user.name
        const cart = await cartsService.getCartById(cid);
        if (cart === null) {
            CustomError.createError({
                message: `Carrito ID: ${cid} no encontrado.`,
                cause: generateCartErrorInfo(),
                code: TErrors.NOT_FOUND,
            });
        }
        const purchaseTicket = await cartsService.purchaseTicket(purchaserEmail, purchaseDatetime, cart);
        await mailer({ mail: purchaserEmail, name: userName }, "Compra confirmada!. podés ver el ticket en el apartado dentro de tu carrito.")
        res.status(200).send(purchaseTicket);
    } catch (error) {
        next(error)
    }
}

async function getUserTickets(req, res, next) {
    const { userEmail } = req.params;
    try {
        const userTickets = await cartsService.getUserTickets(userEmail);
        if (userTickets === null || userTickets.length === 0) {
            CustomError.createError({
                message: "Aún No existen tickets.",
                cause: generateCartErrorInfo(),
                code: TErrors.NOT_FOUND,
            });
        }
        res.status(200).send(userTickets);
    } catch (error) {
        next(error)
    }
}

export { getCart, deleteProductToCart, deleteAllProducts, updateCart, addProductAndQuantity, purchaseCart, getUserTickets };