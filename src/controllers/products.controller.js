const productsModel = require("../models/products.model");
const { error } = require("../utils/response");

const getProducts = async (req, res) => {
	try {
		const { query } = req;
		const fullUrl = req.protocol + '://' + req.get('host');
		const result = await productsModel.getProducts(query);

		if (result.rows.length < 1) {
			return error(res, { status: 404, message: "Data Not Found" });
		}

		const meta = await productsModel.getMetaProducts(query, fullUrl);

		res.status(200).json({
			data: result.rows,
			meta,
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const getProductDetail = async (req, res) => {
	try {
		const { params } = req;
		const result = await productsModel.getProductDetail(params);

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

const insertProducts = async (req, res) => {
	try {
		const { body, file } = req;
		const result = await productsModel.insertProducts(body, file);
		res.status(201).json({
			data: result.rows,
			message: "Created Successfully",
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const updateProduct = async (req, res) => {
	try {
		const { params, body, file } = req;
		let result;
		//TODO: better use return, find the way
		if (file === undefined) {
			result = await productsModel.updateProduct(params, body);
		} else {
			result = await productsModel.updateProductWithFile(params, body, file);
		}
		res.status(200).json({
			data: result.rows,
			message: "Updated Successfully",
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const deleteProduct = async (req, res) => {
	try {
		const { params } = req;
		const result = await productsModel.deleteProduct(params);
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
	getProducts,
	getProductDetail,
	insertProducts,
	updateProduct,
	deleteProduct,
};
