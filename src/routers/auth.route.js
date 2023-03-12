const { Router } = require("express");

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth");
const {checkRole} = require("../middlewares/checkRole");

const authRouter = Router();

authRouter.post("/", authController.login);
authRouter.patch("/", authMiddleware.checkToken, authController.editPassword);
authRouter.get("/private", checkRole, authMiddleware.checkToken, authController.privateAccess);

module.exports = authRouter;