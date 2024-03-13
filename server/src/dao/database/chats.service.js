import messagesModel from "./models/chats.model.js";

export default class Messages {

    async getUserMessages(email) {
        let messages = await messagesModel.find({ email: email }).lean();
        return messages;
    }

    async saveMessage(email, message) {
        let newMessage = new messagesModel(email, message);
        await newMessage.save();
    }

    async saveAndGetUserMessages(email, message) {
        let newMessage = new messagesModel(email, message);
        await newMessage.save();
        let messages = await messagesModel.find({ email: email }).lean();
        return messages;
    }

};