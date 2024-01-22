import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        }
    ]
});

const cartsModel = mongoose.model(cartCollection, cartSchema);
export default cartsModel;

