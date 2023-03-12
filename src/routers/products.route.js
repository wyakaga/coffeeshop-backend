const { Router } = require("express");

const productsController = require("../controllers/products.controller");
const { checkToken } = require("../middlewares/auth");
const { singleUpload } = require("../middlewares/productDiskUpload");

const productsRouter = Router();

productsRouter.get("/", checkToken, productsController.getProducts);
productsRouter.get("/:productId", checkToken, productsController.getProductDetail);
productsRouter.post("/", checkToken, productsController.insertProducts);
productsRouter.patch("/:productId", checkToken, productsController.updateProduct);
productsRouter.patch(
	"/img/:productId",
	checkToken,
	singleUpload("img"),
	productsController.updateProductImage
);
productsRouter.delete("/:productId", checkToken, productsController.deleteProduct);

module.exports = productsRouter;
