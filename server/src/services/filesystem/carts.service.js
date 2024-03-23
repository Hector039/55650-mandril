import fs from "fs";
import UserService from "./users.service.js";
import ProductService from "./products.service.js";
import TicketsService from "./tickets.service.js";

const productService = new ProductService();
const ticketService = new TicketsService();
const userService = new UserService();

class Cart {
    constructor(id, products) {
        this._id = id;
        this.products = products
    }
}

export default class CartService {
    #path;
    #ultimoId = 0;

    constructor() {
        this.#path = "src/services/filesystem/archivoCarritos.json";
        this.#setUltimoId();
    }

    async saveCart() {
        try {
            const productos = [];

            const newCart = new Cart(
                ++this.#ultimoId,
                productos
            );

            const carts = await this.getCarts();
            carts.push(newCart);
            await this.saveCarts(carts);
            return newCart;
        } catch (error) {
            throw error;
        }
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.#path)) {
                const carts = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));
                return carts;
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find((cart) => cart._id === parseInt(id));
            if (cart === undefined) {
                return null;
            }
            const products = await productService.getAllProducts();
            const cartProducts = cart.products.map((prod) => {
                return {
                    product: products.find((producto) => producto._id === prod.product),
                    quantity: prod.quantity
                };
            });
            cart["products"] = cartProducts
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async addProductAndQuantityToCart(cid, pid, quantity) {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex((cart) => cart._id === parseInt(cid));
            const cartIndexProduct = carts[cartIndex].products.findIndex((prod) => prod.product === parseInt(pid));

            if (cartIndexProduct < 0) {
                const newProductToCart = {
                    product: parseInt(pid),
                    quantity: quantity
                }
                carts[cartIndex].products.push(newProductToCart);
            } else {
                carts[cartIndex].products[cartIndexProduct].quantity = quantity;
            }

            await this.saveCarts(carts);
            const cartsUpdated = await this.getCarts();
            const temporalProducts = await productService.getAllProducts();

            const cartProducts = cartsUpdated[cartIndex].products.map((prod) => {
                return {
                    product: temporalProducts.find((producto) => producto._id === prod.product),
                    quantity: prod.quantity,
                };
            });
            cartsUpdated[cartIndex]["products"] = cartProducts
            return cartsUpdated[cartIndex];
        } catch (error) {
            throw error;
        }
    }

    async deleteProductToCart(cid, product) {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex((cart) => cart._id === parseInt(cid));
            if (cartIndex < 0) {
                throw new Error(`El carrito ${cid} no existe.`);
            }
            const cartIndexProduct = carts[cartIndex].products.findIndex((prod) => prod.product === parseInt(product.product._id));

            if (cartIndexProduct < 0) {
                throw new Error(`Producto ${product.product._id} no encontrado en el carrito ${cid}`);
            } else {
                carts[cartIndex].products.splice(cartIndexProduct, 1);
            }

            await this.saveCarts(carts);

            const cartsUpdated = await this.getCarts();
            const temporalProducts = await productService.getAllProducts();

            const cartProducts = cartsUpdated[cartIndex].products.map((prod) => {
                return {
                    product: temporalProducts.find((producto) => producto._id === prod.product),
                    quantity: prod.quantity,
                };
            });
            cartsUpdated[cartIndex]["products"] = cartProducts
            return cartsUpdated[cartIndex];
            return cartInfo;
        } catch (error) {
            throw error;
        }
    };

    async deleteAllProducts(cid) {
        try {
            let carts = await this.getCarts();
            const cartIndex = carts.findIndex((cart) => cart._id === parseInt(cid));
            if (cartIndex < 0) {
                throw new Error(`El carrito ${cid} no existe.`);
            }
            carts[cartIndex].products = [];
            await this.saveCarts(carts);
            const cartsUpdated = await this.getCarts();
            return cartsUpdated[cartIndex];
        } catch (error) {
            throw error;
        }
    };

    async purchaseTicket(purchaserEmail, purchaseDatetime, cart) {
        try {
            let unavaliableProducts = []
            let avaliableProducts = []

            let products = await productService.getAllProducts();

            cart.products.forEach(cartProd => {
                products.forEach(prod => {
                    if (cartProd.product._id === prod._id) {
                        if (prod.stock >= cartProd.quantity) {
                            prod.stock = prod.stock - cartProd.quantity
                            avaliableProducts.push(cartProd)
                        } else if (prod.stock <= cartProd.quantity) {
                            unavaliableProducts.push(cartProd.product)
                        }
                    }
                })
            })
            
            await productService.guardarProductos(products);

            const newTicket = {
                code: purchaseDatetime + (Math.floor(Math.random() * 100 + 1)).toString(),
                purchase_datetime: purchaseDatetime,
                amount: avaliableProducts.length === 0 ? 0 : (avaliableProducts.reduce((acc, prodPrice) => acc += (prodPrice.product.price * prodPrice.quantity), 0)).toFixed(2),
                purchaser: purchaserEmail
            }

            const ticket = avaliableProducts.length === 0 ? "Sin Stock" : await ticketService.saveTicket(newTicket)
            
            const userByEmail = await userService.getUser(purchaserEmail)
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(cart => cart._id === parseInt(userByEmail.cart));

            let newValues = []
            function filterprod(prod) {
                unavaliableProducts.forEach(item => {
                    if (item._id === prod.product._id) {
                        prod["product"] = item._id
                        newValues.push(prod)
                    }
                })
            }
            cart.products.filter(filterprod)
            carts[cartIndex]["products"] = newValues
            await this.saveCarts(carts)
            const updatedCart = await this.getCartById(userByEmail.cart);
            return ({ ticket: ticket, cart: updatedCart })
        } catch (error) {
            throw error;
        }
    }

    async getUserTickets(userEmail) {
        try {
            const userTickets = await ticketService.getUserTickets(userEmail)
            return userTickets;
        } catch (error) {
            throw error;
        }
    }

    async #setUltimoId() {
        try {
            const carts = await this.getCarts();

            if (carts.length < 1) {
                this.#ultimoId = 0;
                return;
            }

            this.#ultimoId = carts[carts.length - 1]._id;

        } catch (error) {
            throw error;
        }
    }

    async saveCarts(carts) {
        try {
            await fs.promises.writeFile(this.#path, JSON.stringify(carts));
        } catch (error) {
            throw error;
        }
    }
}
