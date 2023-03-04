const usersModel = require("../models/users.model");

const getUsers = async (req, res) => {
	try {
		const { limit } = req.query;

		const result = await usersModel.getUsers(limit);
		console.log(limit);
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
	getUsers,
};
