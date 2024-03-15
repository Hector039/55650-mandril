import { productGenerator } from "../tools/utils.js";
//import CustomError from "../tools/customErrors/customError.js";

async function fakerProducts(req, res, next) {
    try {
        let mockProducts = []
        const quantityProducts = 100
        let n = 0
        while (n < quantityProducts) {
            n++
            let fakerProduct = productGenerator()
            mockProducts.push(fakerProduct)
        }
        res.status(200).send({
            quantity: mockProducts.length,
            data: mockProducts
        });
    } catch (error) {
        next(error)
    }
}

export { fakerProducts }