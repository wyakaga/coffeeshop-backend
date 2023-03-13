const { Router } = require("express");

const productsController = require("../controllers/products.controller");
const { checkToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/checkRole");
const { singleUpload } = require("../middlewares/productDiskUpload");

const productsRouter = Router();

productsRouter.get("/", checkToken, productsController.getProducts);
productsRouter.get("/:productId", checkToken, productsController.getProductDetail);
productsRouter.post("/", checkRole, checkToken, singleUpload("img"), productsController.insertProducts);
productsRouter.patch("/:productId", checkRole, checkToken, singleUpload("img"), productsController.updateProduct);
productsRouter.delete("/:productId", checkRole, checkToken, productsController.deleteProduct);

module.exports = productsRouter;
