const db = require("../configs/postgre");

const getPromos = (query) => {
	return new Promise((resolve, reject) => {
		let sql = `select id, product_img, product_name, concat(discount, '%') as discount,
    promo_desc, promo_code, promo_start, promo_end
    from promos order by `;
		let order = "id ASC";
		if (query.order === "recent") {
			order = "promo_start DESC";
		}
		if (query.order === "oldest") {
			order = "promo_start ASC";
		}
		sql += order;

		db.query(sql, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const getPromoDetail = (params) => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT id, product_img, product_name, concat(discount, '%') as discount,
		 				promo_desc, promo_code, promo_start, promo_end FROM promos WHERE id = $1`;
		const values = [params.promoId];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const insertPromos = (data) => {
	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO promos (product_img, product_name, discount, promo_desc, promo_code, promo_start, promo_end)
						VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
		const values = [
			data.product_img,
			data.product_name,
			data.discount,
			data.promo_desc,
			data.promo_code,
			data.promo_start,
			data.promo_end,
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
		SET product_img = $1, product_name = $2, discount = $3, promo_desc = $4, promo_code = $5, promo_start = $6, promo_end = $7
		WHERE id = $8 RETURNING *`;
		const values = [
			data.product_img,
			data.product_name,
			data.discount,
			data.promo_desc,
			data.promo_code,
			data.promo_start,
			data.promo_end,
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
