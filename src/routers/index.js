const { Router } = require("express");
const welcomeRouter = require("./welcome.route");
const usersRouter = require("./users.route");
const productsRouter = require("./products.route");
const promosRouter = require("./promos.route");
const historyRouter = require("./history.route");
const authRouter = require("./auth.route");

const mainRouter = Router();

mainRouter.use("/", welcomeRouter);
mainRouter.use("/users", usersRouter);
mainRouter.use("/products", productsRouter);
mainRouter.use("/promos", promosRouter);
mainRouter.use("/history", historyRouter);
mainRouter.use("/auth", authRouter);

module.exports = mainRouter;
