const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../configs/env");

const checkToken = (req, res, next) => {
	const bearerToken = req.header("Authorization");

	if (!bearerToken) {
		return res.status(403).json({ msg: "Please login first" });
	}

	const token = bearerToken.split(" ")[1];

	jwt.verify(token, jwtSecret, (error, payload) => {
		if (error && error.name) {
			return res.status(403).json({ msg: error.message });
		}

		if (error) {
			return res.status(500).json({ msg: "Internal Server Error" });
		}

		req.authInfo = payload;
		next();
	});
};

module.exports = { checkToken };
