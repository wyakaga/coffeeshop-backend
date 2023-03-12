const db = require("../configs/postgre");

const getPromos = (query) => {
	return new Promise((resolve, reject) => {
		let order;
		if (query.order === "recent") {
			order = "start DESC";
		}
		if (query.order === "oldest") {
			order = "start ASC";
		}

		const sql = `select *
    from promos
		where title ilike $1
		order by ${order || "id asc"}
		limit $2`;

		const values = [`%${query.search || ""}%`, `${query.limit || 5}`];

		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const getPromoDetail = (params) => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM promos WHERE id = $1`;
		const values = [params.promoId];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const insertPromos = (data) => {
	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO promos (img, title, desc, code, discount, start, end, product_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
		const values = [
			data.img,
			data.title,
			data.desc,
			data.code,
			data.discount,
			data.start,
			data.end,
			data.product_id,
		];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const updatePromo = (params, data) => {
	return new Promise((resolve, reject) => {
		const sql = `UPDATE promos
		SET img = $1, title = $2, desc = $3, code = $4, discount = $5, start = $6, end = $7, product_id = $8
		WHERE id = $9 RETURNING *`;
		const values = [
			data.img,
			data.title,
			data.desc,
			data.code,
			data.discount,
			data.start,
			data.end,
			data.product_id,
			params.promoId,
		];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const deletePromo = (params) => {
	return new Promise((resolve, reject) => {
		const sql = "DELETE FROM promos WHERE id = $1 RETURNING *";
		const values = [params.promoId];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

module.exports = {
	getPromos,
	getPromoDetail,
	insertPromos,
	updatePromo,
	deletePromo,
};
