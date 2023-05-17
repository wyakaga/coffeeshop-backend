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
		${
			query.category === undefined
				? `where p.name ilike $1 or c."name" ilike $2`
				: `where p.name ilike $1 and c."name" ilike $2`
		}
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
		let categoryCondition = "";
		const values = [`%${query.search || ""}%`];

		if (query.category !== undefined) {
			categoryCondition = ' AND c."name" ilike $2';
			values.push(`${query.category}%`);
		}

		const sql = `SELECT COUNT(*) AS total_data FROM products p
					JOIN categories c ON p.category_id = c.id
					WHERE p.name ilike $1${categoryCondition}`;

		db.query(sql, values, (err, result) => {
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
		const sql =
			"INSERT INTO products (name, price, img, category_id, description) VALUES ($1, $2, $3, $4, $5) RETURNING *";
		const values = [data.name, data.price, fileLink, data.category_id, data.description];
		db.query(sql, values, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		});
	});
};

const updateProduct = (params, data, fileLink) => {
	return new Promise((resolve, reject) => {
		let sqlColumns = [];
		let values = [];
		let index = 1;

		if (data.name) {
			sqlColumns.push(`name = $${index++}`);
			values.push(data.name);
		}

		if (data.price) {
			sqlColumns.push(`price = $${index++}`);
			values.push(data.price);
		}

		if (fileLink) {
			sqlColumns.push(`img = $${index++}`);
			values.push(fileLink);
		}

		if (data.category_id) {
			sqlColumns.push(`category_id = $${index++}`);
			values.push(data.category_id);
		}

		if (data.description) {
			sqlColumns.push(`description = $${index++}`);
			values.push(data.description);
		}

		const sql = `UPDATE products SET ${sqlColumns.join(", ")} WHERE id = $${index} RETURNING *`;
		values.push(params.productId);

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
	deleteProduct,
};
