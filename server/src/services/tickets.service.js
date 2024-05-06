export default class TicketsService {
    constructor(repository) {
        this.ticketsRepo = repository;
    }

    async saveTicket(ticket) {
        try {
            const newTicket = await this.ticketsRepo.saveTicket(ticket)
            return newTicket;
        } catch (error) {
            throw error;
        }
    };

    purchaseTicket = async (purchaserEmail, purchaseDatetime, cart) => {
        const result = await this.ticketsRepo.purchaseTicket(purchaserEmail, purchaseDatetime, cart);
        return result;
    };

    getUserTickets = async (userEmail) => {
        const result = await this.ticketsRepo.getUserTickets(userEmail);
        return result;
    };
};