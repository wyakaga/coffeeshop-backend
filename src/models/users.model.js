const db = require("../configs/postgre");

const getUsers = (limit) => {
	return new Promise((resolve, reject) => {
		let sql = `select u.id, u."email", u."password", u."phone_number", u."address", u."display_name",
		u."first_name", u."last_name", u."birth_date", u."gender", r."name" as "role_name"
		from users u join roles r on u.role_id = r.id ORDER BY id ASC LIMIT ${limit}`;
		db.query(sql, (err, result) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(result);
		});
	});
};

const getUserDetail = (params) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT * FROM users WHERE id = $1";
		const values = [params.userId];
		db.query(sql, values, (error, result) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(result);
		});
	});
};

const insertUsers = (data) => {
	return new Promise((resolve, reject) => {
		const sql =
			"INSERT INTO users (email, password, phone_number, role_id) VALUES ($1, $2, $3, $4) RETURNING *";
		const values = [data.email, data.password, data.phone_number, data.role_id];
		db.query(sql, values, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		});
	});
};

module.exports = {
	getUsers,
	getUserDetail,
	insertUsers,
};
