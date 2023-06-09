const usersModel = require("../models/users.model");
const authModel = require("../models/auth.model");
const db = require("../configs/postgre");
const { error } = require("../utils/response");
const { uploader, deleter } = require("../utils/cloudinary");

const getUsers = async (req, res) => {
	try {
		const { query } = req;
		const result = await usersModel.getUsers(query);

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

const getUserDetail = async (req, res) => {
	try {
		const { params } = req;
		const result = await usersModel.getUserDetail(params);

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

const insertUsers = async (req, res) => {
	const { body } = req;
	const client = await db.connect();
	try {
		const verificationResult = await authModel.userVerification(body);
		if (verificationResult.rows.length > 0) {
			return error(res, { status: 400, message: "Email has been registered" });
		}

		await client.query("BEGIN");
		const result = await usersModel.insertUsers(client, body);
		const userId = result.rows[0].id;
		await usersModel.insertDetailUsers(client, userId);
		await client.query("COMMIT");
		client.release();
		res.status(200).json({
			message: "OK",
		});
	} catch (err) {
		console.log(err.message);
		await client.query("ROLLBACK");
		client.release();
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const updateUserData = async (req, res) => {
	try {
		const { params, body } = req;

		const { data, err, msg } = await uploader(req, "users", params.userId);
		if (err) throw { msg, err };

		let fileLink;
		if (data !== null) {
			fileLink = data.secure_url;
		}
		const result = await usersModel.updateUserData(params, body, fileLink);

		res.status(200).json({
			data: result.rows,
			message: "Updated Successfully",
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const deleteUserImage = async (req, res) => {
	try {
		const { params } = req;

		const checkUser = await usersModel.getUserDetail(params);

		if (!checkUser.rows.length) {
			return error(res, { status: 404, message: "Data Not Found" });
		}

		if (checkUser.rows[0].img) {
			const { data, err, message } = await deleter(checkUser.rows[0].img);
			if (err) throw { message, err };
			console.log("user image", data);
		}

		const result = await usersModel.deleteImageUser(params);

		res.status(200).json({
			data: result.rows,
			message: "Successfully Deleted",
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
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
			message: "Successfully Deleted",
		});
	} catch (err) {
		console.log(err.message);
		await client.query("ROLLBACK");
		client.release();
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

module.exports = {
	getUsers,
	getUserDetail,
	insertUsers,
	updateUserData,
	deleteUser,
	deleteUserImage,
};
