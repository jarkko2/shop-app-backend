const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  email: { 
    type: String,
    maxLength: 100
  },
  subject: {
    type: String,
    maxLength: 100
  },
  text: {
    type: String,
    required: true,
    maxLength: 2000
  },
  date: {
    type: Date,
    required: true
  },
  reply: {
    type: String
  }
})

module.exports = mongoose.model('Feedback', feedbackSchema)
