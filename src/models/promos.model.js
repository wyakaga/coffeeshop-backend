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

module.exports = {
	getPromos,
	getPromoDetail,
};
