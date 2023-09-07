const ShopCart = require('../models/ShopCart')
const Order = require('../models/Order')
const Item = require('../models/Item')
const asyncWrapper = require('../middleware/asyncErrors.js')
const { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode, } = require('http-status-codes')
const {createOrderControllerError} = require('../errors/ordererror')

const { SearchWithTimeRange } = require('./functions/dateformatter')
const { SortByProperty } = require('./functions/sorting')
const { deleteWithId, getWithId } = require('./functions/requestsById')
const { getTotal } = require('./functions/itemTotal')
const config = require('../utils/config');

const getOrders = asyncWrapper(async (req, res, next) => {
  const { open, owner, startDate, endDate, sort } = req.query
  let queryObject = {}

  if (open) {
    queryObject["completed"] = open == "true"
  }
  if (owner) {
    queryObject["owner"] = owner
  }

  // If startDate or endDate is found, make sure both are defined
  if (startDate || endDate) {
    queryObject["date"] = SearchWithTimeRange(startDate, endDate, next, createOrderControllerError)

    // Do not continue if date is undefined => some errors happened in dateformatter
    if (queryObject["date"] == null){
      return
    }
  }

  let result

  // sort by
  if (sort) {
    result = SortByProperty(Order.find(queryObject).populate('items', { name: 1, price: 1 }), sort)
  } else {
    // no sorting
    result = Order.find(queryObject).populate('items', { name: 1, price: 1 })
  }

  const orders = await result

  const formattedOrders = FormatOrdersToTotals(orders)
  if (formattedOrders.ordersWithTotals.length >= 1) {
    res.status(StatusCodes.OK).json({ orders: formattedOrders.ordersWithTotals, totalMoneyMade: formattedOrders.totalMoneyMade })
  } else {
    return next(createOrderControllerError(`Did not found orders`, StatusCodes.NOT_FOUND))
  }
})

const getUserOrderHistory = asyncWrapper(async (req, res, next) => {
  const { sort } = req.query
  const user = config.ENV == "test" ? req.body.username : req.user.username

  let result

  // sort by
  if (sort) {
    result = SortByProperty(Order.find({ owner: user }).populate('items', { name: 1, price: 1 }), sort)
  } else {
    // no sorting
    result = Order.find({ owner: user }).populate('items', { name: 1, price: 1 })
  }
  const orders = await result
  const formattedOrders = FormatOrdersToTotals(orders)

  if (formattedOrders.ordersWithTotals.length >= 1) {
    res.status(StatusCodes.OK).json({ orders: formattedOrders.ordersWithTotals, totalMoneySpent: formattedOrders.totalMoneyMade })
  } else {
    return next(createOrderControllerError(`Did not found orders for ${user}`, StatusCodes.NOT_FOUND))
  }

})

function FormatOrdersToTotals(orders) {
  // Initialize variables
  let ordersWithTotals = []
  let totalMoneyMade = 0.0

  // Run for loop
  GoThroughOrders()

  // Return results
  return { ordersWithTotals, totalMoneyMade }

  function GoThroughOrders() {
    for (let i = 0; i < orders.length; i++) {
      let orderTotal = getTotal(orders[i].items)
      totalMoneyMade += orderTotal
      let customOrder = CreateOrderItem(orders[i], orderTotal)

      // Do not show empty orders
      if (orders[i].items.length > 0) {
        ordersWithTotals.push(customOrder)
      }
    }
  }
}

function CreateOrderItem(order, total) {
  var customOrder = {
    "Id": order.id,
    "owner": order.owner,
    "date": order.date,
    "items": order.items,
    "total": total,
    "completed": order.completed,
  };
  return customOrder
}

const getOrderById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params

  // Check if order exists
  if (await getWithId(Order, id, next, createOrderControllerError) != null) {
    const order = await Order.findById(id).populate('items', { name: 1, price: 1 })

    orderTotal = 0

    for (let j = 0; j < order.items.length; j++) {
      orderTotal += order.items[j].price
    }

    var customOrder = CreateOrderItem(order, orderTotal)

    return res.status(StatusCodes.OK).json({ success: true, data: customOrder })
  }


})

const toggleOrderCompleted = asyncWrapper(async (req, res, next) => {
  const { id } = req.params
  // Check if order exists
  if (await getWithId(Order, id, next, createOrderControllerError) != null) {
    const order = await Order.findByIdAndUpdate(id,
      [
        { $set: { completed: { $not: "$completed" } } }
      ], { returnDocument: "after" }
    )
    res.status(StatusCodes.OK).json({ orderId: order._id, completed: order.completed })
  }
})

const toggleAllOrdersCompleted = asyncWrapper(async (req, res, next) => {

  const orders = await Order.updateMany(
    {
      $set: { completed: true }
    }
  )

  res.status(StatusCodes.OK).json({ orders })
})

const deleteOrderById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params
  const item = await deleteWithId(Order, id, next, createOrderControllerError)
  if (item) {
    res.status(StatusCodes.OK).send({ success: item, itemId: id })
  }
})

module.exports = { getOrders, getOrderById, toggleOrderCompleted, getUserOrderHistory, toggleAllOrdersCompleted, deleteOrderById }