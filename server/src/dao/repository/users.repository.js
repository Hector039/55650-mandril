export default class UsersRepository {
    constructor(model) {
        this.usersModel = model;
    }

    getUser = async (id) => {
        let user = await this.usersModel.findOne({$or: [{email: id}, {idgoogle: id}, {idgithub: id}]}).populate("cart").lean();
        return user;
    };

    getUserById = async (id) => {
            const userById = await this.usersModel.findById(id).populate("cart").lean();
            return userById
    };

    saveUser = async (user) => {
        let newUser = new this.usersModel(user);
        let result = await newUser.save();
        return result;
    };

    updateUser = async (email, toUpdate) => {
        const user = await this.usersModel.findOneAndUpdate({ email: email }, { password: toUpdate });
        return user;
    };

    userVerification = async (email) => {
        await this.usersModel.findOneAndUpdate({ email: email }, { verified: true });
        return
    };

    premiumSelector = async (email, userType) => {
        await this.usersModel.findOneAndUpdate({ email: email }, { role: userType });
        return
    };

    deleteUser = async (id) => {
        await this.usersModel.findOneAndDelete({ _id: id });
        return;
};

}