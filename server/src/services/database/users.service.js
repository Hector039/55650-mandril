import UsersDTO from "../../dao/DTO/usersDTO.js";

export default class UserService {
    constructor(repository) {
        this.userRepo = repository;
    }

    async getUser(id) {
        const result = await this.userRepo.getUser(id);
        return result;
    }

    async saveUser(user) {
        const newUser = new UsersDTO(user);
        newUser["password"] = user.password
        const result = await this.userRepo.saveUser(newUser);
        return result;
    }

    async updateUser(id, password) {
        const result = await this.userRepo.updateUser(id, password);
        return result;
    }

};