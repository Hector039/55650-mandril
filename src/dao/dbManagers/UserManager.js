import userModel from "../models/usermodel.js";

export default class Users {

    async getUser(email, password) {
        let user = await userModel.findOne({email: email, password: password}).populate("cart").lean();
        return user;
    }

    async saveUser(user) {
        let newUser = new userModel(user);
        let result = await newUser.save();
        return result;
    }

    async deleteUser(id) {
        const result = await userModel.findByIdAndDelete(id);
        return result;
    }
};