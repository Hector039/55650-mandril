import getEnvironment from "../config/process.config.js";
import mongoLoader from "../loaders/mongoose.js";
import repositories from "../dao/repository/index.js";

const env = getEnvironment();

export let usersService;
export let productsService;
export let cartsService;
export let ticketsService;

switch (env.PERSISTENCE) {
    case "DATABASE":
        const monogLoader = await mongoLoader(env.DB_URL);
        console.log(monogLoader);

        const { default: usersDaoMongo } = await import("./database/users.service.js");
        usersService = new usersDaoMongo(repositories.users);

        const { default: productsDaoMongo } = await import("./database/products.service.js");
        productsService = new productsDaoMongo(repositories.products);
        
        const { default: cartsDaoMongo } = await import("./database/carts.service.js");
        cartsService = new cartsDaoMongo(repositories.carts);

        const { default: ticketsDaoMongo } = await import("./database/tickets.service.js");
        ticketsService = new ticketsDaoMongo(repositories.tickets);

        break;

    case "FILESYSTEM":
        const { default: usersDaoFileSystem } = await import("./filesystem/users.service.js");
        usersService = new usersDaoFileSystem();

        const { default: productsDaoFileSystem } = await import("./filesystem/products.service.js");
        productsService = new productsDaoFileSystem();

        const { default: cartsDaoFileSystem } = await import("./filesystem/carts.service.js");
        cartsService = new cartsDaoFileSystem();

        const { default: ticketsDaoFileSystem } = await import("./database/tickets.service.js");
        ticketsService = new ticketsDaoFileSystem();

        break;

    default: throw new Error("La persistencia ingresada no existe");
    
}
