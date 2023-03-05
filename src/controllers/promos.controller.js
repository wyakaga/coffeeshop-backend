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

const getPromoDetail = async (req, res) => {
	try {
		const { params } = req;
		const result = await promosModel.getPromoDetail(params);
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

const insertPromos = async (req, res) => {
	try {
		const { body } = req;
		const result = await promosModel.insertPromos(body);
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

const updatePromo = async (req, res) => {
	try {
		const { params } = req;
		const { body } = req;
		const result = await promosModel.updatePromo(params, body);
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

const deletePromo = async (req, res) => {
	try {
		const { params } = req;
		const result = await promosModel.deletePromo(params);
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
	getPromos,
	getPromoDetail,
	insertPromos,
	updatePromo,
	deletePromo,
};
