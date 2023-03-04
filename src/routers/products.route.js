const { Router } = require("express");

const productsController = require("../controllers/products.controller");

const productsRouter = Router();

productsRouter.get("/", productsController.getProducts);
productsRouter.get("/:productId", productsController.getProductDetail);
productsRouter.post("/", productsController.insertProducts);

module.exports = productsRouter;
