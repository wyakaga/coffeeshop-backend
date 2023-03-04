const { Router } = require("express");

const promosController = require("../controllers/promos.controller");

const promosRouter = Router();

promosRouter.get("/", promosController.getPromos);

module.exports = promosRouter;
