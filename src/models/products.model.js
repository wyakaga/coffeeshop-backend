const db = require("../configs/postgre");

const getProducts = (query) => {
	return new Promise((resolve, reject) => {
		let sql = `select p.id, p.product_name, p.price, p.product_img, c."name" as "category_name"
		from products p
		join categories c on p.category_id = c.id ORDER BY `;
		let order = "id ASC";
		if (query.order === "cheapest") {
			order = "price ASC";
		}
		if (query.order === "priciest") {
			order = "price DESC";
		}
		sql += order;

		db.query(sql, (error, result) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(result);
		});
	});
};

const getProductDetail = (params) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM products WHERE id = $1";
		const values = [params.productId];
		db.query(sql, values, (error, result) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(result);
		});
	});
};

const insertProducts = (data) => {
	return new Promise((resolve, reject) => {
		const sql =
			"insert into products (product_name, price, product_img, category_id) values ($1, $2, $3, $4) RETURNING *";
		const values = [
			data.product_name,
			data.price,
			data.product_img,
			data.category_id,
		];
		db.query(sql, values, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		});
	});
};

const updateProduct = (params, data) => {
	return new Promise((resolve, reject) => {
		const sql = "UPDATE products SET product_name = $1, price = $2, product_img = $3, category_id = $4 WHERE id = $5 RETURNING *";
		const values = [data.product_name, data.price, data.product_img, data.category_id, params.productId];
		db.query(sql, values, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		});
	});
};

module.exports = {
	getProducts,
	getProductDetail,
	insertProducts,
	updateProduct
};
