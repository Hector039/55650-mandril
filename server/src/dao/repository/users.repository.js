export default class UsersRepository {
    constructor(model) {
        this.usersModel = model;
    }

    getUser = async (id) => {
        let user = await this.usersModel.findOne({$or: [{email: id}, {idgoogle: id}, {idgithub: id}]}).populate("cart").lean();
        return user;
    };

    saveUser = async (user) => {
        let newUser = new this.usersModel(user);
        let result = await newUser.save();
        return result;
    };

    updateUser = async (email, toUpdate) => {
        const user = await this.usersModel.findOneAndUpdate({ email: email }, { password: toUpdate }, { new: true });
        return user;
    };

}