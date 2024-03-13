import cartModel from "./models/carts.model.js";
import ticketModel from "./models/ticket.model.js";
import productsModel from "./models/products.model.js";
import userModel from "./models/users.model.js";

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

    async updateCart(cid, cartProducts) {
        try {
            await cartModel.updateOne({ _id: cid }, { $set: { "products": cartProducts } });
            return;
        } catch (error) {
            throw error;
        }
    };

    async deleteProductToCart(id, productToDelete) {
        try {
            await cartModel.findByIdAndUpdate(id, { $pull: { products: { product: productToDelete.product, quantity: productToDelete.quantity } } });
            const cartById = await this.getCartById(id)
            return cartById;
        } catch (error) {
            throw error;
        }
    };

    async deleteAllProducts(id) {
        try {
            await cartModel.findByIdAndUpdate(id, { $push: { products: { $each: [], $slice: 0 } } });
            const cartById = await this.getCartById(id)
            return cartById;
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
            return updatedCart.products;
        } catch (error) {
            throw error;
        }
    };

    async saveTicket(ticket) {
        try {
            let newTicket = new ticketModel(ticket);
            let result = await newTicket.save();
            return result;
        } catch (error) {
            throw error;
        }
    };

    async purchaseTicket(purchaserEmail, purchaseDatetime, cart) {
        try {
            let unavaliableProducts = []
            let avaliableProducts = []
            let ids = []

            cart.products.forEach(prod => {
                ids.push(prod.product._id)
            });

            const prodDataBase = await productsModel.find({ '_id': { $in: ids } });

            cart.products.forEach(productInCart => {
                prodDataBase.forEach(prodDB => {
                    if ((productInCart.product._id).toString() === (prodDB._id).toString()) {
                        if (prodDB.stock >= productInCart.quantity) {
                            prodDB.stock = prodDB.stock - productInCart.quantity
                            avaliableProducts.push(productInCart)
                        } else if (prodDB.stock <= productInCart.quantity) {
                            unavaliableProducts.push(productInCart)
                        }
                    }
                })
            })

            async function updateStock(prod) {
                return await productsModel.updateOne({ _id: prod._id }, { stock: prod.stock });
            }
            prodDataBase.forEach(updateStock);

            const newTicket = {
                code: purchaseDatetime + (Math.floor(Math.random() * 100 + 1)).toString(),
                purchase_datetime: purchaseDatetime,
                amount: avaliableProducts.length === 0 ? 0 : (avaliableProducts.reduce((acc, prodPrice) => acc += (prodPrice.product.price * prodPrice.quantity), 0)).toFixed(2),
                purchaser: purchaserEmail
            }

            const ticket = avaliableProducts.length === 0 ? "Sin Stock" : await this.saveTicket(newTicket)

            const userByEmail = await userModel.findOne({ email: purchaserEmail })

            const unavaliableProdsMap = unavaliableProducts.map(prod => {
                return {
                    product: prod.product._id,
                    quantity: prod.quantity
                }
            })

            await cartModel.replaceOne({ _id: userByEmail.cart }, { products: unavaliableProdsMap });
            const updatedCart = await this.getCartById(userByEmail.cart);
            return ({ ticket: ticket, cart: updatedCart })
        } catch (error) {
            throw error;
        }
    }

    async getUserTickets(userEmail) {
        try {
            const user = await userModel.findOne({email: userEmail})
            if (user === null) {
                throw new Error("El usuario no existe")
            } 
            const userTickets = await ticketModel.find({purchaser: userEmail});
            return userTickets;
        } catch (error) {
            throw error;
        }
    };

};