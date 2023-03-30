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

		const sql = `select p.id, p.name, p.price, p.img, c."name" as "category_name"
		from products p
		join categories c on p.category_id = c.id
		${query.category === undefined ? `where p.name ilike $1 or c."name" ilike $2` : `where p.name ilike $1 and c."name" ilike $2`}
		order by ${order || "id asc"}
		limit $3
		offset $4`;

		const page = query.page || 1;
		const limit = query.limit || 25;
		const offset = (parseInt(page) - 1) * parseInt(limit);

		const values = [`%${query.search || ""}%`, `${query.category}%`, `${limit}`, offset];

		db.query(sql, values, (error, result) => {
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
		const sql = `SELECT p.id, p.name, p.price, p.img, p.description , c."name" as "category_name"
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

const getMetaProducts = (query, fullUrl) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT COUNT(*) AS total_data FROM products";
		db.query(sql, (err, result) => {
			if (err) return reject(err);
			const totalData = parseInt(result.rows[0].total_data);
			const page = query.page || 1;
			const limit = query.limit || 25;
			const totalPage = Math.ceil(totalData / parseInt(limit));

			let prev = parseInt(page) === 1 ? null : `${fullUrl}/products?page=${parseInt(page) - 1}`;
			let next =
				parseInt(page) === totalPage ? null : `${fullUrl}/products?page=${parseInt(page) + 1}`;

			const meta = { totalData, prev, next, totalPage };
			resolve(meta);
		});
	});
};

const nextIdValue = () => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT LAST_VALUE + 1 AS next_value FROM products_id_seq";
		db.query(sql, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		});
	});
};

const insertProducts = (data, fileLink) => {
	return new Promise((resolve, reject) => {
		const sql = "insert into products (name, price, img, category_id) values ($1, $2, $3, $4) RETURNING *";
		const values = [data.name, data.price, fileLink, data.category_id];
		db.query(sql, values, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		});
	});
};

const updateProduct = (params, data) => {
	return new Promise((resolve, reject) => {
			const sql =
			"UPDATE products SET name = $1, price = $2, category_id = $3 WHERE id = $4 RETURNING *";
		const values = [data.name, data.price, data.category_id, params.productId];

		db.query(sql, values, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		});
	});
};

const updateProductWithFile = (params, data, fileLink) => {
	return new Promise((resolve, reject) => {
			const sql =
			"UPDATE products SET name = $1, price = $2, img = $3, category_id = $4 WHERE id = $5 RETURNING *";
		const values = [data.name, data.price, fileLink, data.category_id, params.productId];

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
	getMetaProducts,
	nextIdValue,
	insertProducts,
	updateProduct,
	updateProductWithFile,
	deleteProduct,
};
