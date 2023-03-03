const { Router } = require("express");

const usersController = require("../controllers/users.controller");

const usersRouter = Router();

usersRouter.get("/", usersController.getUsers);

module.exports = usersRouter;
