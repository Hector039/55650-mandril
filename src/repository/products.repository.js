import ProductsDTO from "../dao/DTO/productsDTO.js";

export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }
    
    getAllProducts = async () => {
        const result = await this.dao.getAllProducts();
        return result;
    };

    searchProducts = async (text) => {
        const result = await this.dao.searchProducts(text);
        return result;
    };

    saveProduct = async (product) => {
        const newProduct = new ProductsDTO(product);
        const result = await this.dao.saveProduct(newProduct);
        return result;
    };

    getProductById = async (id) => {
        const result = await this.dao.getProductById(id);
        return result;
    };

    updateProduct = async (pid, product) => {
        const result = await this.dao.updateProduct(pid, product);
        return result;
    };

    deleteProduct = async (pid) => {
        const result = await this.dao.deleteProduct(pid);
        return result;
    }

    paginateProduct = async (find, options) => {
        const result = await this.dao.paginateProduct(find, options);
        return result;
    }
};