const historyModel = require("../models/history.model");
const db = require("../configs/postgre");
const { error } = require("../utils/response");

const getHistory = async (req, res) => {
	try {
		const { authInfo } = req;
		const result = await historyModel.getHistory(authInfo.id);

		if (result.rows.length < 1) {
			return error(res, { status: 404, message: "Data Not Found" });
		}

		res.status(200).json({
			data: result.rows,
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const getHistoryDetail = async (req, res) => {
	try {
		const { params } = req;
		const result = await historyModel.getHistoryDetail(params);

		if (result.rows.length < 1) {
			return error(res, { status: 404, message: "Data Not Found" });
		}

		res.status(200).json({
			data: result.rows,
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const insertHistory = async (req, res) => {
	const { authInfo, body } = req;
	const client = await db.connect();
	try {
		await client.query("BEGIN");
		const result = await historyModel.insertHistory(client, body, authInfo.id);
		const historyId = result.rows[0].id;
		await historyModel.insertDetailHistory(client, body, historyId);
		await client.query("COMMIT");
		const resultDetails = await historyModel.getModifiedHistory(client, historyId);
		client.release();
		res.status(200).json({
			data: resultDetails.rows,
			message: "OK",
		});
	} catch (err) {
		console.log(err.message);
		await client.query("ROLLBACK");
		client.release();
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const updateHistory = async (req, res) => {
	try {
		const { params } = req;
		const { body } = req;
		const result = await historyModel.updateHistory(params, body);
		res.status(200).json({
			data: result.rows,
			message: "Updated Successfully",
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const deleteHistory = async (req, res) => {
	const { params, query, authInfo } = req;
	const client = await db.connect();

	try {
		await client.query("BEGIN");
		const countResult = await historyModel.checkHistory(client, params.historyId);
		const count = countResult.rows[0].count;

		let historyId = null;

		if (count < 2) {
			await historyModel.deleteAllDetailHistory(client, params.historyId);
		} else {
			await historyModel.deleteDetailHistory(client, params.historyId, query.productId);
		}

		if (count < 2) {
			const result = await historyModel.deleteHistory(client, authInfo.id, params.historyId);
			historyId = result.rows[0].id;
		}

		await client.query("COMMIT");

		if (historyId) {
			const resultDetails = await historyModel.getModifiedHistory(client, historyId);
			client.release();
			return res.status(200).json({
				data: resultDetails.rows,
				message: "Successfully Deleted",
			});
		} else {
			client.release();
			return res.status(200).json({
				message: "Successfully Deleted",
			});
		}
	} catch (err) {
		console.log(err.message);
		await client.query("ROLLBACK");
		client.release();
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

//* admin
const getPendingTransaction = async (req, res) => {
	try {
		const result = await historyModel.getPendingTransaction();

		if (result.rows.length < 1) {
			return error(res, { status: 404, message: "Data Not Found" });
		}

		res.status(200).json({
			data: result.rows,
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const updateTransactionStatus = async (req, res) => {
	try {
		const { params } = req;
		const result = await historyModel.updateTransactionStatus(params.historyId);

		res.status(200).json({
			data: result.rows[0],
			message: "Updated successfully",
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const getMonthlyReport = async (req, res) => {
	try {
		const result = await historyModel.getMonthlyReport();

		if (result.rows.length < 1) {
			return error(res, { status: 404, message: "Data Not Found" });
		}

		res.status(200).json({
			data: result.rows,
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const getDailyTransactions = async (req, res) => {
	try {
		const result = await historyModel.getDailyTransactions();

		if (result.rows.length < 1) {
			return error(res, { status: 404, message: "Data Not Found" });
		}

		res.status(200).json({
			data: result.rows,
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

module.exports = {
	getHistory,
	getHistoryDetail,
	insertHistory,
	updateHistory,
	deleteHistory,
	getPendingTransaction,
	updateTransactionStatus,
	getMonthlyReport,
	getDailyTransactions,
};
