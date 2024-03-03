import getEnvironment from "../config/process.config.js";
import mongoLoader from "../loaders/mongoose.js";

const env = getEnvironment();

export let usersDao;
export let productsDao;
export let cartsDao;

switch (env.PERSISTENCE) {
    case "DATABASE":
        const monogLoader = await mongoLoader(env.DB_URL);
        console.log(monogLoader);
        const { default: usersDaoMongo } = await import("./database/users.service.js");
        usersDao = new usersDaoMongo();

        const { default: productsDaoMongo } = await import("./database/products.service.js");
        productsDao = new productsDaoMongo();
        
        const { default: cartsDaoMongo } = await import("./database/carts.service.js");
        cartsDao = new cartsDaoMongo();
        break;

    case "FILESYSTEM":
        const { default: usersDaoFileSystem } = await import("./filesystem/users.service.js");
        usersDao = new usersDaoFileSystem();

        const { default: productsDaoFileSystem } = await import("./filesystem/products.service.js");
        productsDao = new productsDaoFileSystem();

        const { default: cartsDaoFileSystem } = await import("./filesystem/carts.service.js");
        cartsDao = new cartsDaoFileSystem();
        break;

    default: throw new Error("La persistencia ingresada no existe");
    
}