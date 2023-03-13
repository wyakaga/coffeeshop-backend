const db = require("../configs/postgre");

const userVerification = (body) => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT u.id, u.password, u.role_id, p.img AS img
    FROM users u
    JOIN profiles p ON u.id = p.user_id
    WHERE email = $1`;
		const values = [body.email];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const getPassword = (userId) => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT u.id, u.password, u.role_id, p.img AS img
    FROM users u
    JOIN profiles p ON u.id = p.user_id
    WHERE id = $1`;
		const values = [userId];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const editPassword = (newPwd, userId) => {
	return new Promise((resolve, reject) => {
		const sql = "UPDATE users SET password = $1 WHERE id = $2";
		const values = [newPwd, userId];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const createOTP = (otp, email) => {
	return new Promise((resolve, reject) => {
		const sql = "UPDATE users SET otp = $1 WHERE email = $2 RETURNING otp";
		const values = [otp, email];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const getOTP = (email) => {
	return new Promise((resolve, reject) => {
		const sql = "SELECT otp FROM users WHERE email = $1";
		const values = [email];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const deleteOTP = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE users SET otp = NULL WHERE email = $1";
    const values = [email];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const forgotPwd = (email, password) => {
	return new Promise((resolve, reject) => {
		const sql = "UPDATE users SET password = $1 WHERE email = $2";
		const values = [password, email];
		db.query(sql, values, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

module.exports = {
	userVerification,
	getPassword,
	editPassword,
	createOTP,
	getOTP,
  deleteOTP,
	forgotPwd,
};
