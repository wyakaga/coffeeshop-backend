const { Router } = require("express");

const historyController = require("../controllers/history.controller");

const historyRouter = Router();

historyRouter.get("/", historyController.getHistory);
historyRouter.get("/:historyId", historyController.getHistoryDetail);
historyRouter.post("/", historyController.insertHistory);
historyRouter.patch("/:historyId", historyController.updateHistory);
historyRouter.delete("/:historyId", historyController.deleteHistory);

module.exports = historyRouter;
