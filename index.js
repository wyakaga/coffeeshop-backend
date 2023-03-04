const express = require("express");

const app = express();
const PORT = 8080;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const mainRouter = require("./src/routers")

app.use(mainRouter)

app.listen(PORT, () => {
	console.log(`server is running at port ${PORT}`);
});
