import fs from "fs";

class Ticket {
    constructor(id, purchase_datetime, amount, purchaser, code) {
        this._id = id;
        this.purchase_datetime = purchase_datetime;
        this.amount = amount;
        this.purchaser = purchaser;
        this.code = code
    }
}

export default class TicketsService {
    #path;
    #ultimoId = 0;

    constructor() {
        this.#path = "src/services/filesystem/archivoTickets.json";
        this.#setUltimoId();
    }


    async getTickets() {
        try {
            if (fs.existsSync(this.#path)) {
                const tickets = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));
                return tickets;
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    async saveTickets(tickets) {
        try {
            await fs.promises.writeFile(this.#path, JSON.stringify(tickets));
        } catch (error) {
            throw error;
        }
    }

    async saveTicket({ purchase_datetime, code, amount, purchaser }) {
        try {
            const newTicket = new Ticket(
                ++this.#ultimoId,
                purchase_datetime,
                amount,
                purchaser,
                code
            );
            const tickets = await this.getTickets();
            tickets.push(newTicket);
            await this.saveTickets(tickets);
            return newTicket;
        } catch (error) {
            throw error;
        }
    }

    async getUserTickets(userEmail) {
        try {
            const tickets = await this.getTickets();
            const userTickets = tickets.filter(ticket => ticket.purchaser === userEmail);
            return userTickets;
        } catch (error) {
            throw error;
        }
    };

    async #setUltimoId() {
        try {
            const tickets = await this.getTickets();

            if (tickets.length < 1) {
                this.#ultimoId = 0;
                return;
            }

            this.#ultimoId = tickets[tickets.length - 1]._id;

        } catch (error) {
            throw error;
        }
    }

}