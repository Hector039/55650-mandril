import fs from "fs";

class Message {
    constructor(id, email, message) {
        this._id = id;
        this.email = email;
        this.message = message;
    }
}

export default class MessageService {
    #path;
    #ultimoId = 0;

    constructor() {
        this.#path = "src/dao/filesystem/archivoMessages.json";
        this.#setUltimoId();
    }

    async getAllMessages() {
        try {
            if (fs.existsSync(this.#path)) {
                const messages = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));
                return messages;
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    async saveMessages(messages) {
        try {
            await fs.promises.writeFile(this.#path, JSON.stringify(messages));
        } catch (error) {
            throw error;
        }
    }

    
    async saveMessage( email, message ) {
        try {

            const newMessage = new Message(
                ++this.#ultimoId,
                email,
                message
            );

            const messagesLog = await this.getAllMessages();
            messagesLog.push(newMessage);
            await this.saveMessages(messagesLog);
            return;
        } catch (error) {
            throw error;
        }
    }

    async saveAndGetUserMessages({ email, message }) {
        try {

            const newMessage = new Message(
                ++this.#ultimoId,
                email,
                message
            );

            const messagesLog = await this.getAllMessages();
            messagesLog.push(newMessage);
            await this.saveMessages(messagesLog);

            const messages = await this.getAllMessages();
            const userMessages = messages.filter(message => message.email === email);
            return userMessages;
        } catch (error) {
            throw error;
        }
    }

    async getUserMessages(email) {
        try {
            const messages = await this.getAllMessages();
            const userMessages = messages.filter(message => message.email === email);
            return userMessages;
        } catch (error) {
            throw error;
        }
    };

    async #setUltimoId() {
        try {
            const messages = await this.getAllMessages();

            if (messages.length < 1) {
                this.#ultimoId = 0;
                return;
            }

            this.#ultimoId = messages[messages.length - 1]._id;
        } catch (error) {
            throw error;
        }
    }

}