import UsersDTO from "../dao/DTO/usersDTO.js";

export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getUser = async (id) => {
        const result = await this.dao.getUser(id);
        return result;
    };

    saveUser = async (user) => {
        const newUser = new UsersDTO(user);
        const result = await this.dao.saveUser(newUser);
        return result;
    };

    updateUser = async (id, password) => {
        const result = await this.dao.updateUser(id, password);
        return result;
    };

}