import {usersDao, productsDao, cartsDao} from "../dao/factory.js";
import CartsRepository from "../repository/carts.repository.js";
import ProductsRepository from "../repository/products.repository.js";
import UsersRepository from "../repository/users.repository.js";

export const cartsService = new CartsRepository(cartsDao);
export const productsService = new ProductsRepository(productsDao);
export const usersService = new UsersRepository(usersDao);