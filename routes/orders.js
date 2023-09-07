const express = require('express')
const router = express.Router()
const {adminRequired, signInRequired} = require('../middleware/auth')

const {
    toggleOrderCompleted,
    getOrders,
    getOrderById,
    getUserOrderHistory,
    toggleAllOrdersCompleted,
    deleteOrderById
  } = require('../controllers/orders')

router.get('/admin', adminRequired, getOrders)
router.get('/admin/:id', adminRequired, getOrderById)
router.post('/admin/:id', adminRequired, toggleOrderCompleted)
router.delete('/admin/:id', adminRequired, deleteOrderById)
router.post('/admin/', adminRequired, toggleAllOrdersCompleted)
router.get('/history', signInRequired, getUserOrderHistory)

module.exports = router