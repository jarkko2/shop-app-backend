const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,    
  },
  price: { 
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Item', itemSchema)
