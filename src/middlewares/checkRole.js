const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../configs/env");

const checkRole = (req, res, next) => {
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

    if (payload.role_id !== 1) return res.status(403).json({ msg: "Unauthorized" });

		req.authInfo = payload.role_id;
		next();
	});
};

module.exports = { checkRole };
