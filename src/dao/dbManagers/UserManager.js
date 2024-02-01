import userModel from "../models/usermodel.js";

export default class Users {

    async getUser(email) {
        let user = await userModel.findOne({ email: email }).populate("cart").lean();
        return user;
    }

    async saveUser(user) {
        let newUser = new userModel(user);
        let result = await newUser.save();
        return result;
    }

    async updateUser(email, toUpdate) {
        const user = await userModel.findOneAndUpdate({ email: email }, { password: toUpdate }, { new: true });
        return user;
    }

    async deleteUser(id) {
        const result = await userModel.findByIdAndDelete(id);
        return result;
    }
};