export default class TicketsRepository {
    constructor(ticketModel, userModel, productModel, cartModel) {
        this.ticketsModel = ticketModel;
        this.usersModel = userModel;
        this.productsModel = productModel;
        this.cartsModel = cartModel;
    }
    
    async saveTicket(ticket) {
        try {
            let newTicket = new this.ticketsModel(ticket);
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

            const prodDataBase = await this.productsModel.find({ '_id': { $in: ids } });

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

            /* async function updateStock(prod) {
                await this.productsModel.updateOne({ _id: prod._id }, { stock: prod.stock });
            }
            prodDataBase.forEach(updateStock); */
            prodDataBase.forEach( async prod => {
                await this.productsModel.updateOne({ _id: prod._id }, { stock: prod.stock });
            })

            const newTicket = {
                code: purchaseDatetime + (Math.floor(Math.random() * 100 + 1)).toString(),
                purchase_datetime: purchaseDatetime,
                amount: avaliableProducts.length === 0 ? 0 : (avaliableProducts.reduce((acc, prodPrice) => acc += (prodPrice.product.price * prodPrice.quantity), 0)).toFixed(2),
                purchaser: purchaserEmail
            }

            const ticket = avaliableProducts.length === 0 ? "Sin Stock" : await this.saveTicket(newTicket)

            const userByEmail = await this.usersModel.findOne({ email: purchaserEmail })

            const unavaliableProdsMap = unavaliableProducts.map(prod => {
                return {
                    product: prod.product._id,
                    quantity: prod.quantity
                }
            })

            await this.cartsModel.replaceOne({ _id: userByEmail.cart }, { products: unavaliableProdsMap });
            const updatedCart = await this.cartsModel.findById(userByEmail.cart);
            return ({ ticket: ticket, cart: updatedCart })
        } catch (error) {
            throw error;
        }
    }
    
    async getUserTickets(userEmail) {
        try {
            const user = await this.usersModel.findOne({ email: userEmail })
            if (user === null) {
                throw new Error("El usuario no existe")
            }
            const userTickets = await this.ticketsModel.find({ purchaser: userEmail });
            return userTickets;
        } catch (error) {
            throw error;
        }
    };
};