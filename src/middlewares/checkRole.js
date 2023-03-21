const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../configs/env");
const { error } = require("../utils/response");

const checkRole = (req, res, next) => {
	const bearerToken = req.header("Authorization");

	if (!bearerToken) {
		return error(res, { status: "403", message: "Please login first" });
	}

	const token = bearerToken.split(" ")[1];

	jwt.verify(token, jwtSecret, (err, payload) => {
		if (err && err.name) {
			return error(res, { status: 403, message: err.message });
		}

		if (err) {
			return error(res, { status: 500, message: "Internal Server Error" });
		}

		if (payload.role_id !== 1) return error(res, { status: 403, message: "Unauthorised" });

		req.authInfo = payload.role_id;
		next();
	});
};

module.exports = { checkRole };
