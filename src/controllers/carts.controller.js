import { cartsService, productsService } from "../repository/index.js";

async function getCart(req, res) {//get
    const { cid } = req.params;
    try {
        const cartById = await cartsService.getCartById(cid);
        if (cartById === null) {
            res.sendUserError("Carrito inexistente");
            return;
        };
        res.sendSuccess(cartById);
    } catch (error) {
        res.sendServerError(error);
    }
}

async function deleteProductToCart(req, res) {//delete
    const { pid } = req.params;
    try {
        const productId = await productsService.getProductById(pid);
        const cart = await cartsService.getCartById(req.user.cartId);
        if (cart === null) return res.sendUserError("Carrito inexistente");
        if (productId === null) return res.sendUserError("Producto inexistente");

        const productExistsInCart = cart.products === undefined ? cart.find(prod => prod.product._id === parseInt(pid)) : cart.products.find(prod => prod.product._id == pid);

        if (productExistsInCart === undefined) return res.sendUserError("Producto inexistente en el carrito");

        await cartsService.deleteProductToCart(req.user.cartId, productExistsInCart);
        const cartUpdated = await cartsService.getCartById(req.user.cartId);
        res.sendSuccess(cartUpdated);
    } catch (error) {
        res.sendServerError(error);
    }
}

async function deleteAllProducts(req, res) {//delete
    const { cid } = req.params;
    try {
        const cart = await cartsService.getCartById(cid);
        if (cart === null) return res.sendUserError("Carrito inexistente");
        const cartUpdated = await cartsService.deleteAllProducts(cid);
        res.sendSuccess(cartUpdated);
    } catch (error) {
        res.sendServerError(error);
    }
}

async function updateCart(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const productId = await productsService.getProductById(pid);
        const cart = await cartsService.getCartById(cid);

        if (cart === null) return res.sendUserError("Carrito inexistente");
        if (productId === null) return res.sendUserError("Producto inexistente");

        const productExistsInCart = cart.products.find(prod => prod.product._id == pid);

        if (productExistsInCart === undefined) return res.sendUserError("Producto inexistente en el carrito");

        const modifiedCart = await cartsService.addProductAndQuantityToCart(cid, pid, quantity);
        res.sendSuccess(modifiedCart);
    } catch (error) {
        res.sendServerError(error);
    }
}

async function addProductAndQuantity(req, res) {
    const { pid } = req.params;
    const { quantity } = req.body;
    try {
        const userCart = req.user.cartId;
        const productId = await productsService.getProductById(pid);
        const cart = await cartsService.getCartById(userCart);

        if (cart === null) return res.sendUserError("Carrito inexistente");

        if (productId === null) return res.sendUserError("Producto inexistente");

        const updatedCart = await cartsService.addProductAndQuantityToCart(userCart, pid, quantity);
        res.sendSuccess(updatedCart);
    } catch (error) {
        res.sendServerError(error);
    }
}

async function purchaseCart(req, res) {
    const { cid } = req.params;
    const { purchaseDatetime } = req.body;
    try {
        const purchaserEmail = req.user.email
        const cart = await cartsService.getCartById(cid);
        if (cart === null) return res.sendUserError("Carrito inexistente");
        const purchaseTicket = await cartsService.purchaseTicket(purchaserEmail, purchaseDatetime, cart);
        res.sendSuccess(purchaseTicket);
    } catch (error) {
        res.sendServerError(error);
    }
}

export { getCart, deleteProductToCart, deleteAllProducts, updateCart, addProductAndQuantity, purchaseCart };