import fs from "fs";

class Product {
    constructor(id, title, description, code, price, stock, category, thumbnails, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.thumbnails = thumbnails;
        this.status = status
    }
}

export default class ProductService {
    #path;
    #ultimoId = 0;

    constructor() {
        this.#path = "src/dao/filesystem/archivoProductos.json";
        this.#setUltimoId();
    }

    async saveProduct({title, description, code, price, stock, category, thumbnails}) {
        try {
            const status = true;
            const productos = await this.getAllProducts();
            const productIndex = productos.findIndex(producto => producto.code === code);
            if(productIndex > -1){
                throw new Error(`El código ${code} del producto ingresado ya existe.`);
            }
            const newProduct = new Product(
                ++this.#ultimoId,
                title,
                description,
                code,
                price,
                stock,
                category,
                [ thumbnails ],
                status
            );
            productos.push(newProduct);
            await this.guardarProductos(productos);
            return newProduct;
        } catch (error) {
            throw error;
        }
    }

    async searchProductsFs(text) {
        try {
            const productos = await this.getAllProducts();
            const productosEncontrados = productos.filter(producto => producto.title === text);
            if (productosEncontrados.length === 0) {
                throw new Error(`No existe producto con nombre ${text}, intente nuevamente.`);
            }
            return productosEncontrados;
        } catch (error) {
            throw error;
        }
    }

    async getAllProducts() {
        try {
            if (fs.existsSync(this.#path)) {
                const productos = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));
                return productos;
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const productos = await this.getAllProducts();
            const productoById = productos.find(producto => producto._id === parseInt(id));
            if (productoById === undefined) {
                throw new Error(`Producto ${id} no encontrado, intente con otro ID.`);
            }
            return productoById;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(pid, product){
        try{
            const productos = await this.getAllProducts();
            const productIndex = productos.findIndex(producto => producto.id === parseInt(pid));
            if (productIndex < 0) {
                throw new Error(`Producto ${pid} no encontrado`);
            }
            productos.splice(productIndex, 0, product);
            await this.guardarProductos(productos);
            return product;
        }catch(error){
            throw error;
        }
    }

    async deleteProduct(pid) {
        try{
            const productos = await this.getAllProducts();
            const productIndex = productos.findIndex(producto => producto.id === parseInt(pid));
            if (productIndex < 0) {
                throw new Error(`Producto ${pid} no encontrado`);
            }
            productos.splice(productIndex, 1);
            await this.guardarProductos(productos);
            return productos[productIndex];
        }catch(error){
            throw error;
        }
    }

    async #setUltimoId() {
        try {
            const productos = await this.getAllProducts();
            if (productos.length < 1) {
                this.#ultimoId = 0;
                return;
            }
            this.#ultimoId = productos[productos.length - 1]._id;
        } catch (error) {
            throw error;
        }
    }

    async guardarProductos(productos) {
        try {
            await fs.promises.writeFile(this.#path, JSON.stringify(productos));
        } catch (error) {
            throw error;
        }
    }
}