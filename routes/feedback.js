const express = require('express')
const router = express.Router()
const {adminRequired, signInRequired} = require('../middleware/auth')

const {
  getFeedbacks,
  getFeedbackById,
  sendFeedback,
  deleteFeedbackById,
  getOwnFeedbacks,
  replyToFeedbackById
  } = require('../controllers/feedback')


router.get('/admin', adminRequired, getFeedbacks)
router.get('/admin/:id', adminRequired, getFeedbackById)
router.delete('/admin/:id', adminRequired, deleteFeedbackById)
router.put('/admin/:id', adminRequired, replyToFeedbackById)
router.post('/', signInRequired, sendFeedback)
router.get('/user', signInRequired, getOwnFeedbacks)


module.exports = router