const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authModel = require("../models/auth.model");
const usersModel = require("../models/users.model");
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

		const userId = id;
		const resultDetails = await usersModel.getModifiedUser(userId);

		jwt.sign(payload, jwtSecret, jwtOptions, (error, token) => {
			if (error) throw error;
			res.status(200).json({
				msg: "Welcome",
				token: token,
				data: resultDetails.rows[0],
			});
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

const createOTP = async (req, res) => {
	try {
		const { email } = req.body;

		const generateOTP = () => {
			const digits = "0123456789";
			let OTP = "";
			for (let i = 0; i < 6; i++) {
				OTP += digits[Math.floor(Math.random() * 10)];
			}
			return OTP;
		};

		const otp = generateOTP();
		const result = await authModel.createOTP(otp, email);

		if (result.rows[0] < 1) {
			res.status(404).json({ msg: "No Such Email" });
			return;
		}

		console.log(otp);
		res.status(200).json({
			msg: "Succesfully sent"
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Internal Server Error",
		});
	}
};

const forgotPwd = async (req, res) => {
	try {
		const { email, otp, password } = req.body;
		const otpFromDb = await authModel.getOTP(email);

		if (otpFromDb.rows[0].otp !== otp) {
			res.status(403).json({ msg: "Invalid OTP" });
			return;
		}

		const hashedPwd = await bcrypt.hash(password, 10);
		await authModel.forgotPwd(email, hashedPwd);
		await authModel.deleteOTP(email);
		res.status(200).json({
			msg: "Successfully Changed Password",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Internal Server Error",
		});
	}
};

module.exports = { login, privateAccess, editPassword, createOTP, forgotPwd };
