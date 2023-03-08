const { Pool } = require("pg");

const { host, database, port, user, password } = require("./env");

const db = new Pool({
	host,
	database,
	port,
	user,
	password,
});

module.exports = db;
