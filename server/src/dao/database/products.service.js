import productsModel from "./models/products.model.js";

export default class ProductService {

    async searchProducts(text) {
        let products = await productsModel.find({ $text: { $search: text } }).lean();
        return products;
    }

    async getAllProducts() {
        let products = await productsModel.find().lean();
        return products;
    }

    async getProductById(id) {
        let product = await productsModel.findById(id).lean();
        return product;
    }

    async saveProduct(product) {
        let codeProduct = await productsModel.findOne({ code: product.code });
        if (codeProduct) return "errorCode"
        let newProduct = new productsModel(product);
        let result = await newProduct.save();
        return result;
    }

    async updateProduct(id, product) {
        let codeProduct = await productsModel.findOne({ code: product.code });
        if (codeProduct) return "errorCode"
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