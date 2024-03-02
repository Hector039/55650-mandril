import getEnvironment from "../config/process.config.js";
import usersDaoMongo from "./database/users.service.js";
import usersDaoFileSystem from "./filesystem/users.service.js";
import productsDaoMongo from "./database/products.service.js";
import productsDaoFileSystem from "./filesystem/products.service.js";
import cartsDaoMongo from "./database/carts.service.js";
import cartsDaoFileSystem from "./filesystem/carts.service.js";

const env = getEnvironment();

const persistence = env.PERSISTENCE;

export const usersDao = persistence === "DATABASE" ? new usersDaoMongo() : new usersDaoFileSystem();

export const productsDao = persistence === "DATABASE" ? new productsDaoMongo() : new productsDaoFileSystem();

export const cartsDao = persistence === "DATABASE" ? new cartsDaoMongo() : new cartsDaoFileSystem();