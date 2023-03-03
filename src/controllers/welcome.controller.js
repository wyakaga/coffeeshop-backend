const path = require("path");

const welcomePage = (req, res) => {
  // res.json({
	//   msg: "welcome to coffee shop"
	// // })
	res.status(200).sendFile(path.join(__dirname, "../html/welcome.html"))
}

module.exports = {
  welcomePage
}