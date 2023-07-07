const express = require('express');
const ordersControllers = require('../controllers/orders.controller');
const validationMiddleware = require('../middlewares/validations.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.post(
  '/',
  validationMiddleware.validateCreateOrder,
  ordersControllers.createOrder
);

router.get('/me', ordersControllers.getUserOrders);

router
  .route('/:id')
  .patch(ordersControllers.updateOrder)
  .delete(ordersControllers.deleteOrder);

module.exports = router;
