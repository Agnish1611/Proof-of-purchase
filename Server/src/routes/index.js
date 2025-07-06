const express = require('express');
const router = express.Router();
const controller = require('../controllers');

// Auth
router.post('/register', controller.register);
router.post('/login', controller.login);

// Products
router.post('/products', controller.createProduct);
router.get('/products', controller.listProducts);

// Orders
router.post('/orders', controller.createOrder);
router.get('/orders', controller.listOrders);

// Example endpoint
router.post('/action', controller.handleAction);

module.exports = router;
