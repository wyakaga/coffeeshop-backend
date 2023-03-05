const { Router } = require("express");

const promosController = require("../controllers/promos.controller");

const promosRouter = Router();

promosRouter.get("/", promosController.getPromos);
promosRouter.get("/:promoId", promosController.getPromoDetail);
promosRouter.post("/", promosController.insertPromos);
promosRouter.patch("/:promoId", promosController.updatePromo);
promosRouter.delete("/:promoId", promosController.deletePromo);

module.exports = promosRouter;
