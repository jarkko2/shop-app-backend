const express = require('express')
const router = express.Router()
const {signInRequired} = require('../middleware/auth')

const {
    getItems,
    addToShoppingCart,
    placeOrder,
    clearCart,
    getItemsWithNames,
    removeFromShoppingCart,
    removeAllFromShoppingCart
  } = require('../controllers/shoppingcart')

router.get('/', signInRequired, getItems)
router.post('/', signInRequired, addToShoppingCart)
router.put('/:id', signInRequired, removeFromShoppingCart)
router.put('/removeall/:id', signInRequired, removeAllFromShoppingCart)
router.post('/order', signInRequired, placeOrder)
router.post('/clear', signInRequired, clearCart)
router.get('/names', signInRequired, getItemsWithNames)

module.exports = router