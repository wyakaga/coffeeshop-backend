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
		where p.name ilike $1
		order by ${order || "id asc"}
		limit $2
		offset $3`;

		const page = query.page || 1;
		const limit = query.limit || 5;
		const offset = (parseInt(page) - 1) * parseInt(limit);

		const values = [`%${query.search || ""}%`, `${limit}`, offset];

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
		const sql = `SELECT p.id, p.name, p.price, p.img, c."name" as "category_name"
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

const getMetaProducts = (query) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT COUNT(*) AS total_data FROM products";
		db.query(sql, (err, result) => {
			if (err) return reject(err);
			const totalData = parseInt(result.rows[0].total_data);
			const page = query.page || 1;
			const limit = query.limit || 5;
			const totalPage = Math.ceil(totalData / parseInt(limit));

			//* We know that this shouldn't be hardcoded but it works
			let prev = parseInt(page) === 1 ? null : `localhost:8080/products?page=${parseInt(page) - 1}`;
			let next = parseInt(page) === totalPage ? null : `localhost:8080/products?page=${parseInt(page) + 1}`;

			const meta = { totalData, prev, next, totalPage };
			resolve(meta);
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
			"UPDATE products SET name = $1, price = $2, img = $3, category_id = $4 WHERE id = $5 RETURNING *";
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
	getMetaProducts,
	insertProducts,
	updateProduct,
	deleteProduct,
};
