const mongoose = require('mongoose')
const { Schema } = mongoose

const shoppingCartSchema = new mongoose.Schema({
  owner: { 
    type: String,
    required: true,    
  },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
})

module.exports = mongoose.model('ShopCart', shoppingCartSchema)
