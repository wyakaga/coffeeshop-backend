const db = require("../configs/postgre");

const getHistory = (query) => {
	return new Promise((resolve, reject) => {
		let order;
		if (query.order === "cheapest") {
			order = "price ASC";
		}
		if (query.order === "priciest") {
			order = "price DESC";
		}

		const sql = `SELECT * FROM history
    WHERE product_name ILIKE $1
    ORDER BY ${order || "id ASC"}
    LIMIT $2`;

		const values = [
			`%${query.search || ""}%`,
			`${query.limit || 5}`,
		];

		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const getHistoryDetail = (params) => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM history WHERE id = $1`;
		const values = [params.historyId];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const insertHistory = (data) => {
	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO history (product_name, price, product_img, order_status)
    VALUES ($1, $2, $3, $4) RETURNING *`;
		const values = [
			data.product_name,
			data.price,
			data.product_img,
			data.order_status,
		];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const updateHistory = (params, data) => {
	return new Promise((resolve, reject) => {
		const sql = `UPDATE history SET product_name = $1, price = $2, product_img = $3,order_status = $4
    WHERE id = $5 RETURNING *`;
		const values = [
			data.product_name,
			data.price,
			data.product_img,
			data.order_status,
			params.historyId,
		];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const deleteHistory = (params) => {
	return new Promise((resolve, reject) => {
		const sql = `DELETE FROM history WHERE id = $1 RETURNING *`;
		const values = [params.historyId];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

module.exports = {
	getHistory,
	getHistoryDetail,
	insertHistory,
	updateHistory,
	deleteHistory,
};
