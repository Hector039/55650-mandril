import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, max: 8 },
    role: { type: String, default: "user" },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    }
});

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;