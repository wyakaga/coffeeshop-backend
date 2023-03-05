const historyModel = require("../models/history.model");

const getHistory = async (req, res) => {
	try {
		const { query } = req;
		const result = await historyModel.getHistory(query);
		res.status(200).json({
			data: result.rows,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Internal Server Error",
		});
	}
};

module.exports = {
	getHistory,
};
