const { Router } = require("express");

const { checkToken } = require("../middlewares/auth");

const historyController = require("../controllers/history.controller");

const historyRouter = Router();

historyRouter.get("/", checkToken, historyController.getHistory);
historyRouter.get("/:historyId", checkToken, historyController.getHistoryDetail);
historyRouter.post("/", checkToken, historyController.insertHistory);
historyRouter.patch("/:historyId", checkToken, historyController.updateHistory);
historyRouter.delete("/", checkToken, historyController.deleteHistory);

module.exports = historyRouter;
