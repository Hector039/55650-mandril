import CartsRepository from "./carts.repository.js";
import ProductsRepository from "./products.repository.js";
import UsersRepository from "./users.repository.js";
import TicketsRepository from "./tickets.repository.js";

import cartsModel from "../models/carts.model.js";
import productsModel from "../models/products.model.js";
import usersModel from "../models/users.model.js";
import ticketsModel from "../models/tickets.model.js";

export default {
	carts: new CartsRepository(cartsModel),
	products: new ProductsRepository(productsModel),
	users: new UsersRepository(usersModel),
	tickets: new TicketsRepository(ticketsModel, usersModel, productsModel, cartsModel)
};