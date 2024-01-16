import fs from "fs";
import { ProductManager } from "./ProductManager.js";

const productManager = new ProductManager();

class Cart {
    constructor(id, productos) {
        this.id = id;
        this.productos = productos
    }
}

export class CartManager {
    #path;
    #ultimoId = 0;

    constructor() {
        this.#path = "../../../archivoCarritos.json";
        this.#setUltimoId();
    }

    async createCart(productos = []) {
        try {

            const newCart = new Cart(
                ++this.#ultimoId,
                productos
            );

            const carts = await this.getCarts();
            carts.push(newCart);
            await this.saveCart(carts);

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

            const cart = carts.find((cart) => cart.id === id);

            return cart;
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cid, pid) {
        try {

            const carts = await this.getCarts();
            const cartIndex = carts.findIndex((cart) => cart.id === parseInt(cid));

            const cartIndexProduct = carts[cartIndex].productos.findIndex((prod) => prod.product === parseInt(pid));

            if (cartIndexProduct < 0) {

                const newProductToCart = {
                    product: parseInt(pid),
                    quantity: 1
                }

                carts[cartIndex].productos.push(newProductToCart);

            } else {

                carts[cartIndex].productos[cartIndexProduct].quantity++;
            }

            await this.saveCart(carts);

            const cartUpdated = await this.getCarts();
            const temporalProducts = await productManager.getProducts();

            const cartInfo = cartUpdated[cartIndex].productos.map((prod) => {
                return {
                    product: temporalProducts.find((producto) => producto.id === prod.product),
                    quantity: prod.quantity,
                };
            });

            return cartInfo;

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

            this.#ultimoId = carts[carts.length - 1].id;

        } catch (error) {
            throw error;
        }
    }

    async saveCart(carts) {
        try {
            await fs.promises.writeFile(this.#path, JSON.stringify(carts));
        } catch (error) {
            throw error;
        }
    }
}
