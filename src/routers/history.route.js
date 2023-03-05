const {Router} = require('express');

const historyController = require("../controllers/history.controller");

const historyRouter = Router();

historyRouter.get("/", historyController.getHistory);

module.exports = historyRouter;