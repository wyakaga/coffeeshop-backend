const productsModel = require("../models/products.model");
const { error } = require("../utils/response");
const { uploader, deleter } = require("../utils/cloudinary");

const getProducts = async (req, res) => {
	try {
		const { query } = req;
		const fullUrl = req.protocol + "://" + req.get("host");
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

		const valueResult = await productsModel.nextIdValue();
		const nextValue = valueResult.rows[0].next_value;
		const { data, err, msg } = await uploader(req, "products", nextValue);
		if (err) throw { msg, err };

		if (!file) return error(res, { status: 400, message: "Image Is Required" });
		const fileLink = data.secure_url;
		const result = await productsModel.insertProducts(body, fileLink);

		res.status(201).json({
			data: result.rows[0],
			message: "Created Successfully",
		});
	} catch (err) {
		console.log(err.message);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

const updateProduct = async (req, res) => {
	try {
		const { params, body } = req;

		const { data, err, msg } = await uploader(req, "products", params.productId);
		if (err) throw { msg, err };

		let fileLink;
		if (data !== null) {
			fileLink = data.secure_url;
		}
		const result = await productsModel.updateProduct(params, body, fileLink);

		res.status(200).json({
			data: result.rows[0],
			message: "Updated Successfully",
		});
	} catch (errors) {
		console.log(errors.message);
		error(res, { status: 500, message: "Internal Server Error" });
	}
};

const deleteProduct = async (req, res) => {
	try {
		const { params } = req;

		const checkProduct = await productsModel.getProductDetail(params);

		if (!checkProduct.rows.length) {
			return error(res, { status: 404, message: "Data Not Found" });
		}

		if (checkProduct.rows[0].img) {
			const { data, err, message } = await deleter(checkProduct.rows[0].img);
			if (err) throw { message, err };
			console.log("product image", data);
		}

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
