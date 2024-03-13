import mongoose from "mongoose";

const messagesCollection = "messages";

const messageSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    message: String
});

const messagesModel = mongoose.model(messagesCollection, messageSchema);
export default messagesModel;