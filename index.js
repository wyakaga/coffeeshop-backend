const express = require("express");
const path = require("path")

const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
  // res.json({
  //   msg: "welcome to coffee shop"
  // })
  res.status(200).sendFile(path.join(__dirname, "/src/html/welcome.html"))
})

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
