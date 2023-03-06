const promosModel = require("../models/promos.model");

const getPromos = async (req, res) => {
	try {
		const { query } = req;
		const result = await promosModel.getPromos(query);

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

const getPromoDetail = async (req, res) => {
	try {
		const { params } = req;
		const result = await promosModel.getPromoDetail(params);

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

const insertPromos = async (req, res) => {
	try {
		const { body } = req;
		const result = await promosModel.insertPromos(body);
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

const updatePromo = async (req, res) => {
	try {
		const { params } = req;
		const { body } = req;
		const result = await promosModel.updatePromo(params, body);
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

const deletePromo = async (req, res) => {
	try {
		const { params } = req;
		const result = await promosModel.deletePromo(params);
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
	getPromos,
	getPromoDetail,
	insertPromos,
	updatePromo,
	deletePromo,
};
