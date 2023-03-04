const {Pool} = require("pg")

const host = process.env.DB_HOST
const database = process.env.DB_NAME
const port = process.env.DB_PORT
const user = process.env.DB_USER
const password = process.env.DB_PWD

const db = new Pool({
  host,
  database,
  port,
  user,
  password
})

module.exports = db;