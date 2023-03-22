const db = require("../configs/postgre");
const bcrypt = require("bcrypt");

const getUsers = (query) => {
	return new Promise((resolve, reject) => {
		let order;
		if (query.order === "asc") {
			order = "display_name asc";
		}
		if (query.order === "desc") {
			order = "display_name desc";
		}

		const sql = `SELECT u.email, u.phone_number, p.address, p.display_name, p.first_name, p.last_name, p.birth_date,
		p.gender
		FROM profiles p
		JOIN users u on u.id = p.user_id
		WHERE u.email ILIKE $1
		ORDER BY ${order || "id asc"}
		LIMIT $2`;

		const values = [`%${query.search || ""}%`, `${query.limit || 3}`];

		db.query(sql, values, (err, result) => {
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
		const sql = `SELECT u.email, u.phone_number, p.address, p.display_name, p.first_name, p.last_name, p.birth_date,
		p.gender
		FROM profiles p
		JOIN users u on u.id = p.user_id
		WHERE u.id = $1`;
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

const getModifiedUser = (userId) => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT u.role_id, p.display_name, p.img
		FROM profiles p
		INNER JOIN users u on u.id = user_id
		WHERE u.id = $1`;
		const values = [userId];
		db.query(sql, values, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		});
	});
};

const insertUsers = (client, data) => {
	return new Promise((resolve, reject) => {
		bcrypt
			.hash(data.password, 10)
			.then((hash) => {
				let hashedPassword = "";
				hashedPassword = hash;
				const sql =
					"INSERT INTO users (email, password, phone_number, role_id) VALUES ($1, $2, $3, $4) RETURNING id";
				const values = [data.email, hashedPassword, data.phone_number, data.role_id || 2];
				client.query(sql, values, (error, result) => {
					if (error) return reject(error);
					resolve(result);
				});
			})
			.catch((error) => reject(error));
	});
};

const insertDetailUsers = (client, userId) => {
	return new Promise((resolve, reject) => {
		const sql = "INSERT INTO profiles (user_id) VALUES ($1)";
		const values = [userId];
		client.query(sql, values, (error) => {
			if (error) return reject(error);
			resolve();
		});
	});
};

const updateUserData = (params, data, fileLink) => {
	return new Promise((resolve, reject) => {
		const sql =
			"UPDATE profiles SET address = $1, display_name = $2, first_name = $3, last_name = $4, birth_date = $5, gender = $6, img = $7 WHERE user_id = $8 RETURNING *";
		const values = [
			data.address,
			data.display_name,
			data.first_name,
			data.last_name,
			data.birth_date,
			data.gender,
			fileLink,
			params.userId,
		];
		db.query(sql, values, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		});
	});
};

const deleteUser = (client, userId) => {
	return new Promise((resolve, reject) => {
		const sql = "DELETE FROM users WHERE id = $1 RETURNING id";
		const values = [userId];
		client.query(sql, values, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		});
	});
};

const deleteDetailUsers = (client, userId) => {
	return new Promise((resolve, reject) => {
		const sql = "DELETE FROM profiles WHERE user_id = $1";
		const values = [userId];
		client.query(sql, values, (error) => {
			if (error) return reject(error);
			resolve();
		});
	});
};

module.exports = {
	getUsers,
	getUserDetail,
	getModifiedUser,
	insertUsers,
	insertDetailUsers,
	updateUserData,
	deleteUser,
	deleteDetailUsers,
};
