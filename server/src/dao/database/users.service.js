import userModel from "./models/users.model.js";

export default class UserService {

    async getUser(id) {
        let user = await userModel.findOne({$or: [{email: id}, {idgoogle: id}, {idgithub: id}]}).populate("cart").lean();
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

};