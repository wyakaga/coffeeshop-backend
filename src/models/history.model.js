const db = require("../configs/postgre");

const getHistory = (query) => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT * FROM history LIMIT ${query.limit || 2}`;
		db.query(sql, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

module.exports = {
	getHistory,
};
