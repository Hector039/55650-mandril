import mailer from "../tools/mailer.js";
import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";
import { generateCartErrorInfo } from "../tools/customErrors/info.js";

export default class TicketsController {
    constructor(ticketsService, cartsService) {
        this.ticketsService = ticketsService;
        this.cartsService = cartsService;
    }

    purchaseCart = async (req, res, next) => {
        const { cid } = req.params;
        const { purchaseDatetime } = req.body;
        try {
            if (!purchaseDatetime) {
                CustomError.createError({
                    message: `No se recibió fecha de compra.`,
                    cause: generateCartErrorInfo(),
                    code: TErrors.INVALID_TYPES,
                });
            }
            const purchaserEmail = req.user.email
            const userName = req.user.name
            const cart = await this.cartsService.getCartById(cid);
            if (cart === null) {
                CustomError.createError({
                    message: `Carrito ID: ${cid} no encontrado.`,
                    cause: generateCartErrorInfo(),
                    code: TErrors.NOT_FOUND,
                });
            }
            const purchaseTicket = await this.ticketsService.purchaseTicket(purchaserEmail, purchaseDatetime, cart);
            await mailer({ mail: purchaserEmail, name: userName }, "Compra confirmada!. podés ver el ticket en el apartado dentro de tu carrito.")
            res.status(200).send(purchaseTicket);
        } catch (error) {
            next(error)
        }
    }

    getUserTickets = async (req, res, next) => {
        const { userEmail } = req.params;
        try {
            const userTickets = await this.ticketsService.getUserTickets(userEmail);
            if (userTickets === null || userTickets.length === 0) {
                CustomError.createError({
                    message: "Aún No existen tickets.",
                    cause: generateCartErrorInfo(),
                    code: TErrors.NOT_FOUND,
                });
            }
            res.status(200).send(userTickets);
        } catch (error) {
            next(error)
        }
    }
}