import productsModel from "../models/productModel.js";

export default class Products {

    async getAllProducts() {
        let products = await productsModel.find().lean();
        return products;
    }

    async getProductById(id) {
        let product = await productsModel.findById(id).lean();
        return product;
    }

    async saveProduct(product) {
        let newProduct = new productsModel(product);
        let result = await newProduct.save();
        return result;
    }

    async updateProduct(id, product) {
        const result = await productsModel.updateOne({ _id: id }, product);
        return result;
    }

    async deleteProduct(id) {
        const result = await productsModel.findByIdAndDelete(id);
        return result;
    }

    async paginateProduct(find, options) {
        const report = await productsModel.paginate(find, options);
        return report;
    }
    
};