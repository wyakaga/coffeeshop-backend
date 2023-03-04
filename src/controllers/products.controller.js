const productsModel = require("../models/products.model");

const getProducts = async (req, res) => {
	try {
    const {query} = req
		const result = await productsModel.getProducts(query);
		res.status(200).json({
			data: result.rows,
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).json({
			msg: "Internal Server Error",
		});
	}
};

const getProductDetail = async (req, res) => {
	try {
		const { params } = req;
		const result = await productsModel.getProductDetail(params);
		res.status(200).json({
			data: result.rows,
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).json({
			msg: "Internal Server Error",
		});
	}
};

const insertProducts = async (req, res) => {
	try {
		const { body } = req;
		const result = await productsModel.insertProducts(body);
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

module.exports = {
	getProducts,
	getProductDetail,
	insertProducts,
};
