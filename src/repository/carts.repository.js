
export default class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    saveCart = async () => {
        const result = await this.dao.saveCart();
        return result;
    };

    getCartById = async (id) => {
        const result = await this.dao.getCartById(id);
        return result;
    };

    deleteProductToCart = async (id, productToDelete) => {
        const result = await this.dao.deleteProductToCart(id, productToDelete);
        return result;
    };

    deleteAllProducts = async (id) => {
        const result = await this.dao.deleteAllProducts(id);
        return result;
    };

    addProductAndQuantityToCart = async (cid, pid, quantity) => {
        const result = await this.dao.addProductAndQuantityToCart(cid, pid, quantity);
        return result;
    };
}