const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authModel = require("../models/auth.model");
const usersModel = require("../models/users.model");
const { jwtSecret } = require("../configs/env");
const { error } = require("../utils/response");

const login = async (req, res) => {
	try {
		const { body } = req;
		const result = await authModel.userVerification(body);

		if (result.rows.length < 1) {
			return error(res, { status: 401, message: "Invalid Email or Password" });
		}

		const { id, password, role_id, img } = result.rows[0];
		const isPwdValid = await bcrypt.compare(body.password, password);

		if (!isPwdValid) {
			return error(res, { status:401, message: "Invalid Email or Password" });
		}

		const payload = { id, role_id, img };
		const jwtOptions = { expiresIn: "1d" };

		const userId = id;
		const resultDetails = await usersModel.getModifiedUser(userId);

		jwt.sign(payload, jwtSecret, jwtOptions, (error, token) => {
			if (error) throw error;
			res.status(200).json({
				message: "Welcome",
				token: token,
				data: resultDetails.rows[0],
			});
		});
	} catch (err) {
		console.log(err);
		return error(res, { status:500, message: "Internal Server Error" });
	}
};

const privateAccess = (req, res) => {
	const { id, email, role_id, img } = req.authInfo;
	res.status(200).json({ payload: { id, email, role_id, img }, message: "OK" });
};

const editPassword = async (req, res) => {
	const { authInfo, body } = req;
	try {
		const result = await authModel.getPassword(authInfo.id);
		const pwdFromDb = result.rows[0].password;
		const isPwdValid = await bcrypt.compare(body.oldPwd, pwdFromDb);

		if (!isPwdValid) {
			return error(res, { status:403, message: "Wrong Old Password" });
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
			message: "Successfully Edit Password",
			token,
		});
	} catch (err) {
		console.log(err);
		return error(res, { status: 500, message: "Internal Server Error" });
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

		if (result.rows < 1) {
			return error(res, { status: 404, message: "No Such Email" });
		}

		console.log(otp);
		res.status(200).json({
			message: "Succesfully sent"
		});
	} catch (err) {
		console.log(err);
		return error(res, { status:500, message: "Internal Server Error" });
	}
};

const forgotPwd = async (req, res) => {
	try {
		const { email, otp, password } = req.body;
		const otpFromDb = await authModel.getOTP(email);

		if (otpFromDb.rows[0].otp !== otp) {
			return error(res, { status: 403, message: "Invalid OTP" });
		}

		const hashedPwd = await bcrypt.hash(password, 10);
		await authModel.forgotPwd(email, hashedPwd);
		await authModel.deleteOTP(email);
		res.status(200).json({
			message: "Successfully Changed Password",
		});
	} catch (err) {
		console.log(err);
		return error(res, { status: 500, message: "Internal Server Error" });
	}
};

module.exports = { login, privateAccess, editPassword, createOTP, forgotPwd };
