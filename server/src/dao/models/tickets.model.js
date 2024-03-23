import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
    purchase_datetime: { type: String, require: true },
    amount: { type: Number, require: true },
    purchaser: { type: String, require: true },
    code: { type: String, require: true, unique: true },
});

const ticketsModel = mongoose.model(ticketCollection, ticketSchema);
export default ticketsModel;