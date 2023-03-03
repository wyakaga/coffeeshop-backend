const { Router } = require('express');

const productsController = require('../controllers/products.controller')

const productsRouter = Router();

productsRouter.get("/", productsController.getProducts)

module.exports = productsRouter