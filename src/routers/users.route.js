const { Router } = require("express");

const usersController = require("../controllers/users.controller");

const usersRouter = Router();

usersRouter.get("/", usersController.getUsers);
usersRouter.get("/:userId", usersController.getUserDetail);
usersRouter.post("/", usersController.insertUsers);
usersRouter.patch("/:userId", usersController.updateUserData);
usersRouter.delete("/:userId", usersController.deleteUser);

module.exports = usersRouter;
