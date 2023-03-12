const { Router } = require("express");

const usersController = require("../controllers/users.controller");
const { checkToken } = require("../middlewares/auth");
const { singleUpload } = require("../middlewares/profileDiskUpload");

const usersRouter = Router();

usersRouter.get("/", checkToken, usersController.getUsers);
usersRouter.get("/:userId", checkToken, usersController.getUserDetail);
usersRouter.post("/", usersController.insertUsers);
usersRouter.patch("/:userId", checkToken, usersController.updateUserData);
usersRouter.patch(
	"/img/:userId",
	checkToken,
	singleUpload("img"),
	usersController.updateUserImage
);
usersRouter.delete("/", checkToken, usersController.deleteUser);

module.exports = usersRouter;
