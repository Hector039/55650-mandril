import fs from "fs";

class User {
    constructor(id, firstName, lastName, email, password, role, idgoogle, idgithub, cart) {
        this._id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.idgoogle = idgoogle;
        this.idgithub = idgithub;
        this.cart = cart
    }
}

export default class UserService {
    #path;
    #ultimoId = 0;

    constructor() {
        this.#path = "src/services/filesystem/archivoUsers.json";
        this.#setUltimoId();
    }

    async getUser(emailOrId) {
        try {
            const users = await this.getAllUsers();
            const userByEmail = users.find(user => user.email === emailOrId);
            const userById = users.find(user => user._id === emailOrId);
            const userByGoogleId = users.find(user => user.idgoogle === emailOrId);
            const userByGithubId = users.find(user => user.idgithub === emailOrId);
            let user = null;
            if(userByEmail !== undefined){
                user = userByEmail
                return user;
            }
            if(userById !== undefined){
                user = userById
                return user;
            }
            if(userByGoogleId !== undefined){
                user = userByGoogleId
                return user;
            }
            if(userByGithubId !== undefined){
                user = userByGithubId
                return user;
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async guardarUsers(users) {
        try {
            await fs.promises.writeFile(this.#path, JSON.stringify(users));
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        try {
            if (fs.existsSync(this.#path)) {
                const users = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));
                return users;
            }
            return [];
        } catch (error) {
            throw error;
        }
    }

    async saveUser({firstName, lastName, email, password, idgoogle, idgithub, cart}) {
        try {
            const role = "user";
            const users = await this.getAllUsers();
            
            const newUser = new User(
                ++this.#ultimoId,
                firstName,
                lastName,
                email,
                password,
                role,
                idgoogle,
                idgithub,
                cart
            );
            users.push(newUser);
            await this.guardarUsers(users);
            return;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(email, toUpdate) {
        try {
            const users = await this.getAllUsers();
            const userIndex = users.findIndex(user => user.email === email);
            if (userIndex < 0) {
                throw new Error(`Usuario con email:${email} no encontrado`);
            }
            users[userIndex].pasword = toUpdate;
            users.splice(userIndex, 0, users[userIndex]);
            await this.guardarUsers(users);
            const usersUpdated = await this.getAllUsers();
            const userIndexUpdated = usersUpdated.findIndex(user => user.email === email);
            return usersUpdated[userIndexUpdated];
        } catch (error) {
            throw error;
        }
    }

    async #setUltimoId() {
        try {
            const users = await this.getAllUsers();
            if (users.length < 1) {
                this.#ultimoId = 0;
                return;
            }
            this.#ultimoId = users[users.length - 1]._id;
        } catch (error) {
            throw error;
        }
    }
}