import messagesModel from "../models/messagesModel.js";

export default class Messages {

    async getAllMessages() {
        let messages = await messagesModel.find().lean();
        return messages;
    }

    async saveMessage(message) {
        let newMessage = new messagesModel(message);
        await newMessage.save();
    }

};