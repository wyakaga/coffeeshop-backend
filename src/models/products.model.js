const db = require("../configs/postgre");

const getProducts = (query) => {
	return new Promise((resolve, reject) => {
		let order;
		if (query.order === "cheapest") {
			order = "price ASC";
		}
		if (query.order === "priciest") {
			order = "price DESC";
		}

		const sql = `select p.id, p.product_name, p.price, p.product_img, c."name" as "category_name"
		from products p
		join categories c on p.category_id = c.id
		where p.product_name ilike '%${query.search || ""}%'
		order by ${order || "id asc"}
		limit ${query.limit || 5}`;

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
		const sql = `SELECT p.id, p.product_name, p.price, p.product_img, c."name" as "category_name"
		FROM products p
		JOIN categories c on p.category_id = c.id
		WHERE p.id = $1`;
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
		const sql =
			"UPDATE products SET product_name = $1, price = $2, product_img = $3, category_id = $4 WHERE id = $5 RETURNING *";
		const values = [
			data.product_name,
			data.price,
			data.product_img,
			data.category_id,
			params.productId,
		];
		db.query(sql, values, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		});
	});
};

const deleteProduct = (params) => {
	return new Promise((resolve, reject) => {
		const sql = "DELETE FROM products WHERE id = $1 RETURNING *";
		const values = [params.productId];
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
	updateProduct,
	deleteProduct,
};
