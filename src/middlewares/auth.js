const jwt = require("jsonwebtoken");
const { error } = require("../utils/response");

const { jwtSecret } = require("../configs/env");
const authModel = require("../models/auth.model");

const checkToken = (req, res, next) => {
	const bearerToken = req.header("Authorization");

	if (!bearerToken) {
		return error(res, { status: 403, message: "Please login first" });
	}

	const token = bearerToken.split(" ")[1];

	jwt.verify(token, jwtSecret, async (err, payload) => {
		if (err && err.name) {
			return error(res, { status: 403, message: error.message });
		}

		const blackList = await authModel.getBlackList(token);
		if (token === blackList.rows[0].black_list) {
			return error(res, { status: 401, message: "Please Login First" });
		}

		if (err) {
			return error(res, { status: 500, message: error.message });
		}

		req.authInfo = payload;
		next();
	});
};

module.exports = { checkToken };
