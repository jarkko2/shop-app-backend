const mongoose = require('mongoose')
const { Schema } = mongoose

const orderSchema = new mongoose.Schema({
  owner: { 
    type: String,
    required: true,    
  },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' , required: true}],
  date: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Order', orderSchema)
