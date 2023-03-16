const { logError } = require("../models/error.model");

const error = (res, { status, message }) => {
	logError({ status, message }, (err) => {
		if (err) {
			return res.status(500).json({ msg: "Internal server error" });
		}
		res.status(status).json({ msg: message });
	});
};

module.exports = { error };
