const express = require("express");
const mainRouter = require("./src/routers")
const morgan = require("morgan");

const app = express();
const PORT = 8080;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(morgan("combined"))

app.use(mainRouter)

app.listen(PORT, () => {
	console.log(`server is running at port ${PORT}`);
});
