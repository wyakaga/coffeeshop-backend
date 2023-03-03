const express = require("express");

const app = express();
const PORT = 8080;

const mainRouter = require("./src/routers")

app.use(mainRouter)

app.listen(PORT, () => {
	console.log(`server is running at port ${PORT}`);
});
