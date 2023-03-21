const historyModel = require("../models/history.model");
const db = require("../configs/postgre");
const { error } = require("../utils/response");

const getHistory = async (req, res) => {
	try {
		const { query } = req;
		const result = await historyModel.getHistory(query);

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
		await client.query('BEGIN');
		const result = await historyModel.insertHistory(client, body, authInfo.id);
		const historyId = result.rows[0].id;
		await historyModel.insertDetailHistory(client, body, historyId);
		await client.query('COMMIT');
		const resultDetails = await historyModel.getModifiedHistory(client, historyId);
		client.release();
		res.status(200).json({
			data: resultDetails.rows,
			message: "OK",
		});
	} catch (err) {
		console.log(err.message);
		await client.query('ROLLBACK');
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
	const { authInfo } = req;
	const client = await db.connect();
	try {
		await client.query('BEGIN');
		const result = await historyModel.deleteHistory(client, authInfo.id);
		const historyId = result.rows[0].id;
		await historyModel.deleteDetailHistory(client, historyId);
		await client.query('COMMIT');
		const resultDetails = await historyModel.getModifiedHistory(client, historyId);
		client.release();
		res.status(200).json({
			data: resultDetails.rows,
			message: "Successfully Deleted",
		});
	} catch (err) {
		console.log(err.message);
		await client.query('ROLLBACK');
		client.release();
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

module.exports = {
	getHistory,
	getHistoryDetail,
	insertHistory,
	updateHistory,
	deleteHistory,
};
