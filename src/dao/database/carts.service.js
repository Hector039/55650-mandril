import cartModel from "./models/carts.model.js";

export default class CartService {

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
            const result = await cartModel.updateOne({ _id: cid, "products.product": pid }, { $set: { "products.$.quantity": quantity } });
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

    async addProductAndQuantityToCart(cart, pid, quantity) {
        try {
            const cartById = await this.getCartById(cart)
            const cartIndexProduct = cartById.products.findIndex(prod => prod.product._id == pid);
            if (cartIndexProduct < 0) {
                await cartModel.findByIdAndUpdate(cartById._id, { $push: { products: { product: pid, quantity: quantity } } });
            } else {
                await cartModel.updateOne({ _id: cartById._id, "products.product": pid }, { $set: { "products.$.quantity": quantity } });
            }
            const updatedCart = await this.getCartById(cartById._id);
            return updatedCart;
        } catch (error) {
            throw error;
        }
    };

};