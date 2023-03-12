require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mainRouter = require("./src/routers");
const morgan = require("morgan");

const app = express();
const PORT = process.env.SERVER_PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.use(morgan("combined"));

app.use(mainRouter);

app.listen(PORT, () => {
	console.log(`server is running at port ${PORT}`);
});
