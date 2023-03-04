const db = require("../configs/postgre");

const getUsers = () => {
	return new Promise((resolve, reject) => {
		let sql =
		`select u.id, u."email", u."password", u."phone_number", u."address", u."display_name",
		u."first_name", u."last_name", u."birth_date", u."gender", r."name" as "role_name"
		from users u join roles r on u.role_id = r.id ORDER BY id ASC`;
		db.query(sql, (err, result) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(result);
		});
	});
};

module.exports = {
	getUsers,
};
