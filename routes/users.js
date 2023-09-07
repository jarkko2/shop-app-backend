const express = require('express')
const router = express.Router()

const {
  register,
  loginPassword,
  logout,
  onlineCheck
} = require('../controllers/users')

router.post('/register', register)
router.post('/login/password', loginPassword)
router.post('/logout', logout)
router.post('/onlinecheck', onlineCheck)

module.exports = router
