const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

// Public route - Create order
router.post('/', createOrder);

// Admin routes - Get all orders
router.get('/', getAllOrders);

// Admin routes - Get single order
router.get('/:id', getOrderById);

// Admin routes - Update order status
router.put('/:id/status', updateOrderStatus);

// Admin routes - Delete order
router.delete('/:id', deleteOrder);

module.exports = router;
