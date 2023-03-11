const productsModel = require("../models/products.model");

const getProducts = async (req, res) => {
	try {
		const { query } = req;
		const result = await productsModel.getProducts(query);

		if (result.rows.length < 1) {
			res.status(404).json({ msg: "Data Not Found" });
			return;
		}

		const meta = await productsModel.getMetaProducts(query);

		res.status(200).json({
			data: result.rows,
			meta,
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

		if (result.rows.length < 1) {
			res.status(404).json({ msg: "Data Not Found" });
			return;
		}

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
			msg: "Created Successfully",
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			msg: "Internal Server Error",
		});
	}
};

const updateProduct = async (req, res) => {
	try {
		const { params } = req;
		const { body } = req;
		const result = await productsModel.updateProduct(params, body);
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

const deleteProduct = async (req, res) => {
	try {
		const { params } = req;
		const result = await productsModel.deleteProduct(params);
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
	getProducts,
	getProductDetail,
	insertProducts,
	updateProduct,
	deleteProduct,
};
