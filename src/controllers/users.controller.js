const usersModel = require("../models/users.model");

const getUsers = async (req, res) => {
	try {
		let { limit } = req.query;

		limit = limit || 2;

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

const getUserDetail = async (req, res) => {
	try {
		const { params } = req;
		const result = await usersModel.getUserDetail(params);
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

const insertUsers = async (req, res) => {
	try {
		const { body } = req;
		const result = await usersModel.insertUsers(body);
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

const updateUserData = async (req, res) => {
	try {
		const { params } = req;
		const { body } = req;
		const result = await usersModel.updateUserData(params, body);
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

const deleteUser = async (req, res) => {
	try {
		const { params }  = req;
		const result = await usersModel.deleteUser(params);
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
	getUserDetail,
	insertUsers,
	updateUserData,
	deleteUser
};
