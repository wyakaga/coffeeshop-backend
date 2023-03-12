const usersModel = require("../models/users.model");
const db = require("../configs/postgre");

const getUsers = async (req, res) => {
	try {
		const { query } = req;
		const result = await usersModel.getUsers(query);

		if (result.rows.length < 1) {
			res.status(404).jsonp({ msg: "Data Not Found" });
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

const getUserDetail = async (req, res) => {
	try {
		const { params } = req;
		const result = await usersModel.getUserDetail(params);

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

const insertUsers = async (req, res) => {
	const { body } = req;
	const client = await db.connect();
	try {
		await client.query("BEGIN");
		const result = await usersModel.insertUsers(client, body);
		const userId = result.rows[0].id;
		await usersModel.insertDetailUsers(client, userId);
		await client.query("COMMIT");
		const resultDetails = await usersModel.getModifiedUser(client, userId);
		client.release();
		res.status(200).json({
			data: resultDetails.rows,
			msg: "OK",
		});
	} catch (error) {
		console.log(error.message);
		await client.query("ROLLBACK");
		client.release();
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

const updateUserImage = async (req, res) => {
	try {
		const fileLink = `/img/${req.file.filename}`;
		console.log(fileLink);
		const { params } = req;
		const result = await usersModel.updateUserImage(fileLink, params);
		res.status(200).json({
			data: result.rows,
			msg: "Updated Successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Internal Server Error",
		});
	}
};

const deleteUser = async (req, res) => {
	const { authInfo } = req;
	const client = await db.connect();
	try {
		await client.query("BEGIN");
		const result = await usersModel.deleteUser(client, authInfo.id);
		const userId = result.rows[0].id;
		await usersModel.deleteDetailUsers(client, userId);
		await client.query("COMMIT");
		const resultDetails = await usersModel.getModifiedUser(client, userId);
		client.release();
		res.status(200).json({
			data: resultDetails.rows,
			msg: "Successfully Deleted",
		});
	} catch (error) {
		console.log(error.message);
		await client.query("ROLLBACK");
		client.release();
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
	updateUserImage,
	deleteUser,
};
