const db = require("../configs/postgre");

const getHistory = (query) => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT * FROM history LIMIT ${query.limit || 2}`;
		db.query(sql, (err, result) => {
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

module.exports = {
	getHistory,
	getHistoryDetail,
  insertHistory,
};
