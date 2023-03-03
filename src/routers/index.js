const { Router } = require('express');
const welcomeRouter = require('./welcome.route');
const usersRouter = require('./users.route');
const productsRouter = require('./products.route');

const mainRouter = Router();

mainRouter.use("/", welcomeRouter)
mainRouter.use("/users", usersRouter)
mainRouter.use("/products", productsRouter)

module.exports = mainRouter;