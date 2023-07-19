const jwt = require("jsonwebtoken");
const { error } = require("../utils/response");

const { jwtSecret } = require("../configs/env");
const redisClient = require("../configs/redis");

const checkToken = async (req, res, next) => {
	const bearerToken = req.header("Authorization");

	if (!bearerToken) {
		return error(res, { status: 403, message: "Please login first" });
	}

	const token = bearerToken.split(" ")[1];

	jwt.verify(token, jwtSecret, async (err, payload) => {
		if (err && err.name) {
			return error(res, { status: 403, message: err.message });
		}

		redisClient.on("error", err => console.log("[Redis error] " + err));
		await redisClient.connect();
		const blTokenList = await redisClient.get(`bl_${token}`);
		if (blTokenList) {
			return error(res, { status: 401, message: "Invalid token" });
		}
		await redisClient.disconnect();

		if (err) {
			return error(res, { status: 500, message: err.message });
		}

		req.authInfo = payload;
		req.token = token;
		next();
	});
};

module.exports = { checkToken };
