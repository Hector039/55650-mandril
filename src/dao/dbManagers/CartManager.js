import cartModel from "../models/cartModel.js";

export default class Carts {

    async getAllCarts() {
        let carts = await cartModel.find().lean();
        return carts;
    }

    async getCartById(id) {
        let cart = await cartModel.findById(id).lean();
        return cart;
    }

    async saveCart() {
        let newCart = new cartModel();
        let result = await newCart.save();
        return result;
    }

    async updateCart(id, cartProducts) {
        const result = await cartModel.updateOne({ _id: id }, cartProducts);
        return result;
    }

    async deleteCart(id) {
        const result = await cartModel.findByIdAndDelete(id);
        return result;
    }

    async addProductToCart(cart, pid) {
        try {

            const cartIndexProduct = cart.products.findIndex((prod) => prod.product === pid);
            
            if (cartIndexProduct < 0) {

                const newProductToCart = {
                    product: pid,
                    quantity: 1
                }

                cart.products.push(newProductToCart);
                console.log(cart);
            } else {

                cart.products[cartIndexProduct].quantity++;
            }

            const cartUpdated = await this.updateCart({_id: cart._id}, cart);
            
            return cartUpdated;

        } catch (error) {
            throw error;
        }
    }
};