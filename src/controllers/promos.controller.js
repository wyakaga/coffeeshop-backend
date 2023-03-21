const promosModel = require("../models/promos.model");
const { error } = require("../utils/response");

const getPromos = async (req, res) => {
	try {
		const { query } = req;
		const result = await promosModel.getPromos(query);

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

const getPromoDetail = async (req, res) => {
	try {
		const { params } = req;
		const result = await promosModel.getPromoDetail(params);

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

const insertPromos = async (req, res) => {
	try {
		const { body } = req;
		const result = await promosModel.insertPromos(body);
		res.status(201).json({
			data: result.rows,
			message: "Created Successfully",
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const updatePromo = async (req, res) => {
	try {
		const { params, body } = req;
		const result = await promosModel.updatePromo(params, body);
		res.status(200).json({
			data: result.rows,
			message: "Updated Successfully",
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const deletePromo = async (req, res) => {
	try {
		const { params } = req;
		const result = await promosModel.deletePromo(params);
		res.status(200).json({
			data: result.rows,
			message: "Deleted Successfully",
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

module.exports = {
	getPromos,
	getPromoDetail,
	insertPromos,
	updatePromo,
	deletePromo,
};
