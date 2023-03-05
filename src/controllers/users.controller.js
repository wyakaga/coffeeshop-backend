const usersModel = require("../models/users.model");

const getUsers = async (req, res) => {
	try {
		const { query } = req;
		const result = await usersModel.getUsers(query);

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

const getUserDetail = async (req, res) => {
	try {
		const { params } = req;
		const result = await usersModel.getUserDetail(params);

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

const insertUsers = async (req, res) => {
	try {
		const { body } = req;
		const result = await usersModel.insertUsers(body);
		res.status(201).json({
			data: result.rows,
			msg: "Created Successfully",
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
			msg: "Updated Successfully",
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
		const { params } = req;
		const result = await usersModel.deleteUser(params);
		res.status(200).json({
			data: result.rows,
			msg: "Deleted Successfully",
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
	deleteUser,
};
