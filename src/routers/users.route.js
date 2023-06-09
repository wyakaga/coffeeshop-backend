const { Router } = require("express");

const usersController = require("../controllers/users.controller");
const { checkToken } = require("../middlewares/auth");
const memoryUpload = require("../middlewares/memoryUpload");

const usersRouter = Router();

usersRouter.get("/", checkToken, usersController.getUsers);
usersRouter.get("/:userId", checkToken, usersController.getUserDetail);
usersRouter.post("/", usersController.insertUsers);
usersRouter.patch(
	"/:userId",
	checkToken,
	memoryUpload.single("img"),
	usersController.updateUserData
);
usersRouter.delete("/", checkToken, usersController.deleteUser);
usersRouter.delete("/:userId", checkToken, usersController.deleteUserImage);

module.exports = usersRouter;
