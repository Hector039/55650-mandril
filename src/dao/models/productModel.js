import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    thumbnails:{
        type:Array,
        default:[]
    },
    status:{
        type:String,
        default:true
    }
});

const productsModel = mongoose.model(productCollection, productSchema);
export default productsModel;