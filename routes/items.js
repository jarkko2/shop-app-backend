const express = require('express')
const router = express.Router()
const {adminRequired} = require('../middleware/auth')

const {
    getItems,
    createItem,
    getItemById,
    deleteItemById
  } = require('../controllers/items')

router.get('/', getItems)
router.post('/',adminRequired, createItem)
router.get('/:id',adminRequired, getItemById)
router.delete('/:id',adminRequired, deleteItemById)

module.exports = router