require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const mainRouter = require("./src/routers");

const app = express();
const PORT = process.env.SERVER_PORT || 8080;
const mongoUrl = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PWD}@${process.env.MONGO_HOST}/?retryWrites=true&w=majority`;

app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.use(morgan("combined"));

app.use(mainRouter);

mongoose
	.connect(mongoUrl)
	.then(() => {
		console.log("MongoDB Connected");
		app.listen(PORT, () => {
			console.log(`server is running at port ${PORT}`);
		});
	})
	.catch((err) => console.log(err));
