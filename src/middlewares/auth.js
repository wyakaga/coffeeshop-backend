const jwt = require("jsonwebtoken");
const { error } = require("../utils/response");

const { jwtSecret } = require("../configs/env");

const checkToken = (req, res, next) => {
	const bearerToken = req.header("Authorization");

	if (!bearerToken) {
		return error(res, { status: "403", message: "Please login first" });
	}

	const token = bearerToken.split(" ")[1];

	jwt.verify(token, jwtSecret, (error, payload) => {
		if (error && error.name) {
			return error(res, { status: "403", message: error.message });
		}

		if (error) {
			return error(res, { status: "500", message: error.message });
		}

		req.authInfo = payload;
		next();
	});
};

module.exports = { checkToken };
