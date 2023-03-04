const { Router } = require("express");

const usersController = require("../controllers/users.controller");

const usersRouter = Router();

usersRouter.get("/", usersController.getUsers);
usersRouter.get("/:userId", usersController.getUserDetail);
usersRouter.post("/", usersController.insertUsers);

module.exports = usersRouter;
