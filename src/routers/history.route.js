const { Router } = require("express");

const { checkToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/checkRole");

const historyController = require("../controllers/history.controller");

const historyRouter = Router();

//* admin
historyRouter.get("/status", checkToken, checkRole, historyController.getPendingTransaction);
historyRouter.patch(
	"/change-status/:historyId",
	checkToken,
	checkRole,
	historyController.updateTransactionStatus
);
historyRouter.get("/monthly-report", checkToken, checkRole, historyController.getMonthlyReport);
historyRouter.get(
	"/daily-transactions",
	checkToken,
	checkRole,
	historyController.getDailyTransactions
);
historyRouter.get("/reports", checkToken, checkRole, historyController.getReports);

historyRouter.get("/", checkToken, historyController.getHistory); //* common user
historyRouter.get("/:historyId", checkToken, historyController.getHistoryDetail);
historyRouter.post("/", checkToken, historyController.insertHistory); //* common user
historyRouter.patch("/:historyId", checkRole, checkToken, historyController.updateHistory);
historyRouter.delete("/:historyId", checkToken, historyController.deleteHistory); //* common user

module.exports = historyRouter;
