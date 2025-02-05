const express = require('express');
const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
} = require('../controllers/orderController');
const {
  authorizePermissions,
  authenticateUser,
} = require('../middleware/authentication');

const router = express.Router();

router
  .route('/')
  .post(authenticateUser, createOrder)
  .get([authenticateUser, authorizePermissions('admin')], getAllOrders);

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders);

router
  .route('/:id')
  .get(authenticateUser, getSingleOrder);

module.exports = router;
