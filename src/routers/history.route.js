const { Router } = require("express");

const historyController = require("../controllers/history.controller");

const historyRouter = Router();

historyRouter.get("/", historyController.getHistory);
historyRouter.get("/:historyId", historyController.getHistoryDetail);
historyRouter.post("/", historyController.insertHistory);

module.exports = historyRouter;
