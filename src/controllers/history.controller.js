const historyModel = require("../models/history.model");
const db = require("../configs/postgre");

const getHistory = async (req, res) => {
	try {
		const { query } = req;
		const result = await historyModel.getHistory(query);

		if (result.rows.length < 1) {
			res.status(404).json({ msg: "Data Not Found" });
			return;
		}

		res.status(200).json({
			data: result.rows,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			msg: "Internal Server Error",
		});
	}
};

const getHistoryDetail = async (req, res) => {
	try {
		const { params } = req;
		const result = await historyModel.getHistoryDetail(params);

		if (result.rows.length < 1) {
			res.status(404).json({ msg: "Data Not Found" });
			return;
		}

		res.status(200).json({
			data: result.rows,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			msg: "Internal Server Error",
		});
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
		const resultDetails = await historyModel.getInsertHistory(client, historyId);
		client.release();
		res.status(200).json({
			data: resultDetails.rows,
			msg: "OK",
		});
	} catch (error) {
		console.log(error.message);
		await client.query('ROLLBACK');
		client.release();
		res.status(500).json({
			msg: "Internal Server Error",
		});
	}
};

const updateHistory = async (req, res) => {
	try {
		const { params } = req;
		const { body } = req;
		const result = await historyModel.updateHistory(params, body);
		res.status(200).json({
			data: result.rows,
			msg: "Updated Successfully",
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			msg: "Internal Server Error",
		});
	}
};

const deleteHistory = async (req, res) => {
	try {
		const { params } = req;
		const result = await historyModel.deleteHistory(params);
		res.status(200).json({
			data: result.rows,
			msg: "Deleted Successfully"
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			msg: "Internal Server Error",
		});
	}
};

module.exports = {
	getHistory,
	getHistoryDetail,
	insertHistory,
	updateHistory,
	deleteHistory,
};
