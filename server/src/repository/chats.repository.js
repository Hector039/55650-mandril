export default class ChatsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAllMessages = async () => {
        const result = await this.dao.getAllMessages();
        return result;
    };

    saveMessages = async (messages) => {
        const result = await this.dao.saveMessages(messages);
        return result;
    };

    saveMessage = async (email, message) => {
        const result = await this.dao.saveMessage(email, message);
        return result;
    };

    getUserMessages = async (email) => {
        const result = await this.dao.getUserMessages(email);
        return result;
    };

    saveAndGetUserMessages = async (email, message) => {
        const result = await this.dao.saveAndGetUserMessages(email, message);
        return result;
    };

}