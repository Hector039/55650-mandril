export default class ProductsDTO {
    constructor(product) {
        this._id = product._id === undefined ? product.id : product._id;
        this.title = product.title;
        this.description = product.description === null ? "Sin descripción disponible" : product.description;
        this.code = product.code;
        this.price = parseInt(product.price);
        this.stock = parseInt(product.stock);
        this.category = product.category;
        this.thumbnails = product.thumbnails === null ? ["https://www.remab.net/wp-content/uploads/2020/08/sin_imagen.jpg"] : [product.thumbnails];
        this.status = product.status;
    }
}