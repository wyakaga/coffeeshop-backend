const db = require("../configs/postgre");

const getHistory = (userId) => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT  hps.history_id , d.method, p.img, p.name, p.price, hps.product_id, s.name AS transaction_status, pr.display_name AS buyer_name
    FROM history_products_sizes hps
    JOIN history h  ON h.id = hps.history_id
    JOIN products p ON p.id = hps.product_id
    JOIN deliveries d ON d.id = h.delivery_id
    JOIN status s ON s.id = h.status_id
    JOIN users u ON u.id = h.user_id
    JOIN profiles pr ON pr.user_id = u.id
    WHERE h.user_id = $1 AND h.status_id <> 1 AND u.role_id <> 1`;

		const values = [userId];

		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const getHistoryDetail = (params) => {
	//? Temporarily use profile id as params?
	return new Promise((resolve, reject) => {
		const sql = `SELECT p."name" AS "product_name", p."img" AS product_img, hps."subtotal" AS "price", d."method" AS "delivery_method"
		FROM history_products_sizes hps
		INNER JOIN history h ON h.id = hps.history_id
		INNER JOIN products p ON p.id = hps.product_id
		INNER JOIN deliveries d ON d.id = h.delivery_id
		WHERE p.id = $1`;
		const values = [params.historyId];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const getModifiedHistory = (client, historyId) => {
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
		const values = [userId, data.status_id, data.promo_id, data.payment_id, data.delivery_id];
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
		const sql = `UPDATE history SET status_id = $1 WHERE id = $2 RETURNING *`;
		const values = [data.status_id, params.historyId];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const deleteHistory = (client, userId, historyId) => {
	return new Promise((resolve, reject) => {
		const sql = `DELETE FROM history WHERE user_id = $1 AND id = $2 RETURNING id`;
		const values = [userId, historyId];
		client.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const deleteDetailHistory = (client, historyId) => {
	return new Promise((resolve, reject) => {
		let sql = `DELETE FROM history_products_sizes WHERE history_id = $1`;
		let values = [historyId];
		client.query(sql, values, (err) => {
			if (err) return reject(err);
			resolve();
		});
	});
};

//* admin

const getPendingTransaction = () => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT  hps.history_id , d.method, p.img, p.name, p.price, hps.product_id, s.name AS transaction_status, pr.display_name AS buyer_name
    FROM history_products_sizes hps
    JOIN history h  ON h.id = hps.history_id
    JOIN products p ON p.id = hps.product_id
    JOIN deliveries d ON d.id = h.delivery_id
    JOIN status s ON s.id = h.status_id
    JOIN users u ON u.id = h.user_id
    JOIN profiles pr ON pr.user_id = u.id
    WHERE h.status_id = 1 AND u.role_id <> 1
		ORDER BY h.id ASC`;

		db.query(sql, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const updateTransactionStatus = (historyId) => {
	return new Promise((resolve, reject) => {
		const sql = `UPDATE history SET status_id = 3, updated_at = NOW() WHERE id = $1 RETURNING *`;

		const values = [historyId];

		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

module.exports = {
	getHistory,
	getHistoryDetail,
	getModifiedHistory,
	insertHistory,
	insertDetailHistory,
	updateHistory,
	deleteHistory,
	deleteDetailHistory,
	getPendingTransaction,
	updateTransactionStatus,
};
