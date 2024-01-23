import cartModel from "../models/cartModel.js";

export default class Carts {

    async getAllCarts() {
        try {
            let carts = await cartModel.find().lean();
            return carts;
        } catch (error) {
            throw error;
        }
    };

    async getCartById(id) {
        try {
            let cart = await cartModel.findById(id).populate("products.product").lean();
            return cart;
        } catch (error) {
            throw error;
        }
    };

    async saveCart() {
        try {
            let newCart = new cartModel();
            let result = await newCart.save();
            return result;
        } catch (error) {
            throw error;
        }
    };

    async updateCart(cid, pid, quantity) {
        try {
            const result = await cartModel.updateOne({ _id : cid, "products.product": pid}, { $set: { "products.$.quantity": quantity } });
            return result;
        } catch (error) {
            throw error;
        }
    };

    async deleteProductToCart(id, productToDelete) {
        try {
            await cartModel.findByIdAndUpdate(id, { $pull: { products: { product: productToDelete.product, quantity: productToDelete.quantity } } });
            return;
        } catch (error) {
            throw error;
        }
    };

    async deleteAllProducts(id) {
        try {
            await cartModel.findByIdAndUpdate(id, { $push: { products: { $each: [], $slice: 0 } } });
            return;
        } catch (error) {
            throw error;
        }
    };

    async addProductToCart(cart, pid) {
        try {
            const cartIndexProduct = cart.products.findIndex(prod => prod.product._id == pid);
            if (cartIndexProduct < 0) {
                await cartModel.findByIdAndUpdate(cart._id, { $push: { products: { product: pid, quantity: 1 } } });
            } else {
                const quantity = cart.products[cartIndexProduct].quantity+1;
                await cartModel.updateOne({ _id : cart._id, "products.product": pid}, { $set: { "products.$.quantity": quantity } });
            }
            await this.getCartById(cart._id);
            return;
        } catch (error) {
            throw error;
        }
    };

    
    async addProductAndQuantityToCart(cart, pid, quantity) {//endpoint solo creado para la vista detail Product
        try {
            const cartIndexProduct = cart.products.findIndex(prod => prod.product._id == pid);
            if (cartIndexProduct < 0) {
                await cartModel.findByIdAndUpdate(cart._id, { $push: { products: { product: pid, quantity: quantity } } });
            } else {
                await cartModel.updateOne({ _id : cart._id, "products.product": pid}, { $set: { "products.$.quantity": quantity } });
            }
            await this.getCartById(cart._id);
            return;
        } catch (error) {
            throw error;
        }
    };

};