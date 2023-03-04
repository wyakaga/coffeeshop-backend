const promosModel = require("../models/promos.model");

const getPromos = async (req, res) => {
	try {
		const { query } = req;
		const result = await promosModel.getPromos(query);
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
	getPromos,
};
