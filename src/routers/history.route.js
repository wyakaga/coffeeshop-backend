const { Router } = require("express");

const { checkToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/checkRole");

const historyController = require("../controllers/history.controller");

const historyRouter = Router();

historyRouter.get("/", checkToken, historyController.getHistory);
historyRouter.get("/:historyId", checkToken, historyController.getHistoryDetail);
historyRouter.post("/", checkToken, historyController.insertHistory);
historyRouter.patch("/:historyId", checkRole, checkToken, historyController.updateHistory);
historyRouter.delete("/", checkRole, checkToken, historyController.deleteHistory);

module.exports = historyRouter;
