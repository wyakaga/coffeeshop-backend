const db = require("../configs/postgre");

const getPromos = (query) => {
	return new Promise((resolve, reject) => {
		let sql = `select product_img, product_name, concat(discount, '%') as discount,
    promo_desc, promo_code, promo_start, promo_end
    from promos order by `;
		let order = "id ASC";
		if (query.order === "recent") {
			order = "promo_end DESC";
		}
		if (query.order === "oldest") {
			order = "promo_end ASC";
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
		const sql = `SELECT product_img, product_name, concat(discount, '%') as discount,
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

module.exports = {
	getPromos,
	getPromoDetail,
	insertPromos,
};
