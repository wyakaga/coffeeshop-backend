const { Router } = require("express");

const productsController = require("../controllers/products.controller");
const { checkToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/checkRole");
const memoryUpload = require("../middlewares/memoryUpload");

const productsRouter = Router();

productsRouter.get("/", productsController.getProducts);
productsRouter.get("/:productId", productsController.getProductDetail);
productsRouter.post("/", checkRole, checkToken, memoryUpload.single("img"), productsController.insertProducts);
productsRouter.patch("/:productId", checkRole, checkToken, memoryUpload.single("img"), productsController.updateProduct);
productsRouter.delete("/:productId", checkRole, checkToken, productsController.deleteProduct);

module.exports = productsRouter;
