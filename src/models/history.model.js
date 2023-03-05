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

const getHistoryDetail = (params) => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM history WHERE id = $1`;
		const values = [params.historyId];
		db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
	});
};

module.exports = {
	getHistory,
  getHistoryDetail,
};
