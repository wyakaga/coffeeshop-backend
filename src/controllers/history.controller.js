const historyModel = require("../models/history.model");

const getHistory = async (req, res) => {
	try {
		const { query } = req;
		const result = await historyModel.getHistory(query);

		if (result.rows.length < 1) {
			res.status(404).json({ msg: "Data Not Found" });
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
	try {
		const { body } = req;
		const result = await historyModel.insertHistory(body);
		res.status(201).json({
			data: result.rows,
		});
	} catch (error) {
		console.log(error.message);
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
