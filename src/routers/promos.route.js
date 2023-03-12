const { Router } = require("express");

const promosController = require("../controllers/promos.controller");
const { checkToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/checkRole");

const promosRouter = Router();

promosRouter.get("/", promosController.getPromos);
promosRouter.get("/:promoId", promosController.getPromoDetail);
promosRouter.post("/", checkRole, checkToken, promosController.insertPromos);
promosRouter.patch("/:promoId", checkRole, checkToken, promosController.updatePromo);
promosRouter.delete("/:promoId", checkRole, checkToken, promosController.deletePromo);

module.exports = promosRouter;
