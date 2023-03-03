const express = require("express");
const path = require("path");

const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
	// res.json({
	//   msg: "welcome to coffee shop"
	// // })
	// res.status(200).sendFile(path.join(__dirname, "/src/html/welcome.html"))
	const db = require("./src/configs/postgre");
	db.query(
		"select id, email, display_name, birth_date from users",
		(err, result) => {
			if (err) {
				console.log(err.message);
				res.status(500).json({
					msg: "Internal Server Error",
				});
				return;
			}
			res.status(200).json({
				data: result.rows,
			});
		}
	);
});

app.listen(PORT, () => {
	console.log(`server is running at port ${PORT}`);
});
