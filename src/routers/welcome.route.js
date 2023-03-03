const { Router } = require('express');
const path = require("path");

const welcomeRouter = Router()

welcomeRouter.get('/', (req, res) => {
  // res.json({
	//   msg: "welcome to coffee shop"
	// // })
	res.status(200).sendFile(path.join(__dirname, "../html/welcome.html"))
})

module.exports = welcomeRouter