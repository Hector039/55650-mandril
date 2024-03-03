import { cartsService, productsService } from "../repository/index.js";

async function getCart(req, res) {//get
    const { cid } = req.params;
    try {
        const cartById = await cartsService.getCartById(cid);

        if (cartById === null) {
            res.status(400).json({
                error: `El carrito de ID: ${cid} no encontrado`,
            });
            return;
        };

        res.status(201).json({
            msg: `Se encontró el carrito de ID: ${cid}`,
            data: cartById
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}

async function deleteProductToCart(req, res) {//delete
    const { pid } = req.params;
    
    try {
        const userCart = req.user.cart._id === undefined ? req.user.cart : req.user.cart._id;
        const productId = await productsService.getProductById(pid);
        const cart = await cartsService.getCartById(userCart);

        if (cart === null) {
            res.status(400).json({
                error: `El carrito de ID: ${userCart} no encontrado`,
            });
            return;
        };

        if (productId === null) {
            res.status(400).json({
                error: `El producto de ID: ${pid} no encontrado`,
            });
            return;
        };
        
        const productExistsInCart = cart.products === undefined ? cart.find(prod => prod.product._id === parseInt(pid)) : cart.products.find(prod => prod.product._id == pid);

        if (productExistsInCart === undefined) {
            res.status(400).json({
                error: `El producto de ID: ${pid} no fué encontrado en el carrito ID: ${userCart}`,
            });
            return;
        }

        await cartsService.deleteProductToCart(userCart, productExistsInCart);
        const cartUpdated = await cartsService.getCartById(userCart);

        res.status(201).json({
            msg: `Se eliminó el producto ${pid} del carrito ${userCart}`,
            data: cartUpdated
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}

async function deleteAllProducts(req, res) {//delete
    const { cid } = req.params;

    try {
        const cart = await cartsService.getCartById(cid);

        if (cart === null) {
            res.status(400).json({
                error: `El carrito de ID: ${cid} no encontrado`,
            });
            return;
        };

        const cartUpdated = await cartsService.deleteAllProducts(cid);

        res.status(201).json({
            msg: `Se eliminaron todos los productos del carrito ${cid}`,
            data: cartUpdated
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}

async function updateCart(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {

        const productId = await productsService.getProductById(pid);
        const cart = await cartsService.getCartById(cid);

        if (cart === null) {
            res.status(400).json({
                error: `El carrito de ID: ${cid} no encontrado`,
            });
            return;
        };

        if (productId === null) {
            res.status(400).json({
                error: `El producto de ID: ${pid} no encontrado`,
            });
            return;
        };

        const productExistsInCart = cart.products.find(prod => prod.product._id == pid);

        if (productExistsInCart === undefined) {
            res.status(400).json({
                error: `El producto de ID: ${pid} no fué encontrado en el carrito ID: ${cid}`,
            });
            return;
        }

        const modifiedCart = await cartsService.addProductAndQuantityToCart(cid, pid, quantity);

        res.status(201).json({
            msg: `Se actualizó la cantidad del producto ${pid} del carrito ${cid}`,
            data: modifiedCart
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}

async function addProductAndQuantity(req, res) {
    const { pid } = req.params;
    const { quantity } = req.body;
    try {
        const userCart = req.user.cart._id === undefined ? req.user.cart : req.user.cart._id;
        const productId = await productsService.getProductById(pid);
        const cart = await cartsService.getCartById(userCart);

        if (cart === null) {
            res.status(400).json({
                error: `El carrito de ID: ${userCart} no encontrado`,
            });
            return;
        };

        if (productId === null) {
            res.status(400).json({
                error: `El producto de ID: ${pid} no encontrado`,
            });
            return;
        };

        const updatedCart = await cartsService.addProductAndQuantityToCart(userCart, pid, quantity);

        res.status(201).json({
            msg: `Se actualizó el producto ${pid} y cantidad ${quantity} al carrito ${userCart}`,
            data: updatedCart
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}

export { getCart, deleteProductToCart, deleteAllProducts, updateCart, addProductAndQuantity };