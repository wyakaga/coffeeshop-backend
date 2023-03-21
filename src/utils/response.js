const { logError } = require("../models/error.model");

const error = (res, { status, message }) => {
	logError({ status, message }, (err) => {
		let resStatus = parseInt(status);
		if (err) {
			return res.status(500).json({ msg: "Internal server error" });
		}
		res.status(resStatus).json({ msg: message });
	});
};

module.exports = { error };
