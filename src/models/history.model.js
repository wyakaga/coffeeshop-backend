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

const getInsertHistory = (client, historyId) => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT u.email, pf.address , p."name" AS "product", s."name" AS "size", pr.code AS "promo", py.method AS "payment_method",
		st."name" AS "transaction_status", hps.qty, hps.subtotal
		FROM history_products_sizes hps
		INNER JOIN history h ON h.id = hps.history_id
		INNER JOIN products p ON p.id = hps.product_id
		INNER JOIN sizes s  ON s.id = hps.size_id
		INNER JOIN users u ON u.id = h.user_id
		INNER JOIN profiles pf ON pf.user_id = u.id
		INNER JOIN payment py ON py.id = h.payment_id
		INNER JOIN promos pr ON pr.id = h.promo_id
		INNER JOIN status st ON st.id = h.status_id
		WHERE h.id = $1`;
		const values = [historyId];
		client.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const insertHistory = (client, data, userId) => {
	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO history (user_id, status_id, promo_id, payment_id, delivery_id)
    VALUES ($1, $2, $3, $4, $5) RETURNING id`;
		const values = [
			userId,
			data.status_id,
			data.promo_id,
			data.payment_id,
			data.delivery_id,
		];
		client.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const insertDetailHistory = (client, data, historyId) => {
	return new Promise((resolve, reject) => {
		const { products } = data;
		let sql = `INSERT INTO history_products_sizes (history_id, product_id, size_id, qty, subtotal) VALUES `;
		let values = [];
		products.forEach((product, i) => {
			const { product_id, size_id, qty, subtotal } = product;
			if (values.length) sql += ", ";
			sql += `($${1 + 5 * i}, $${2 + 5 * i}, $${3 + 5 * i}, $${4 + 5 * i}, $${5 + 5 * i})`;
			values.push(historyId, product_id, size_id, qty, subtotal);
		});
		client.query(sql, values, (err) => {
			if (err) return reject(err);
			resolve();
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
	getInsertHistory,
	insertHistory,
	insertDetailHistory,
	updateHistory,
	deleteHistory,
};
