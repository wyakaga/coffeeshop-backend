const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authModel = require("../models/auth.model");
const { jwtSecret } = require("../configs/env");

const login = async (req, res) => {
	try {
		const { body } = req;
		const result = await authModel.userVerification(body);

		if (result.rows.length < 1) {
			return res.status(401).json({ msg: "Invalid Email or Password" });
		}

		const { id, password, role_id, img } = result.rows[0];
		const isPwdValid = await bcrypt.compare(body.password, password);

		if (!isPwdValid) {
			return res.status(401).json({ msg: "Invalid Email or Password" });
		}

		const payload = { id, role_id, img };
		const jwtOptions = { expiresIn: "1d" };

		jwt.sign(payload, jwtSecret, jwtOptions, (error, token) => {
			if (error) throw error;
			res.status(200).json({ msg: "Welcome", token });
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Internal Server Error" });
	}
};

const privateAccess = (req, res) => {
	const { id, email, role_id, img } = req.authInfo;
	res.status(200).json({ payload: { id, email, role_id, img }, msg: "OK" });
};

const editPassword = async (req, res) => {
	const { authInfo, body } = req;
	try {
		const result = await authModel.getPassword(authInfo.id);
		const pwdFromDb = result.rows[0].password;
		const isPwdValid = await bcrypt.compare(body.oldPwd, pwdFromDb);

		if (!isPwdValid) {
			return res.status(403).json({ msg: "Wrong Old Password" });
		}
		
		const hashedPassword = await bcrypt.hash(body.newPwd, 10);
		await authModel.editPassword(hashedPassword, authInfo.id);

		const createToken = () => {
      const { id, role_id, img } = result.rows[0];
      const payload = { id, role_id, img };
      const jwtOptions = { expiresIn: "1d" };
      return jwt.sign(payload, jwtSecret, jwtOptions);
    };

    const token = createToken();

    res.status(200).json({
      msg: "Successfully Edit Password",
      token,
    });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Internal Server Error",
		});
	}
};

module.exports = { login, privateAccess, editPassword };
