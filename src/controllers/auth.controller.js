const jwt = require("jsonwebtoken");
const authModel = require("../models/auth.model");
const { jwtSecret } = require("../configs/env");

const login = async (req, res) => {
	try {
		const { body } = req;
		const result = await authModel.userVerification(body);

		if (result.rows.length < 1) {
			return res.status(401).json({ msg: "Invalid Email or Password" });
		}

		jwt.sign(
			result.rows[0],
			jwtSecret,
			{ expiresIn: "1d" },
			(error, token) => {
				if (error) throw error;
				res.status(200).json({ msg: "Welcome", token });
			}
		);
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Internal Server Error" });
	}
};

const privateAccess = (req, res) => {
	//TODO: don't forget to get the profile image
	const { id, email } = req.authInfo;
	res.status(200).json({ payload: { id, email }, msg: "OK" });
};

module.exports = { login, privateAccess };
