const {Pool} = require("pg")

const db = new Pool({
  host: "localhost",
  database: "coffee_shop",
  port: 5432,
  user: "fulan",
  password: "fulan"
})

module.exports = db;