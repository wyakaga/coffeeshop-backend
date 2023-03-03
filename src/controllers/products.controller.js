const db = require('../configs/postgre')

const getProducts = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products")
    res.status(200).json({
      data: result.rows
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({
      msg: "Internal Server Error",
    })
  }
}

module.exports = {
  getProducts
}