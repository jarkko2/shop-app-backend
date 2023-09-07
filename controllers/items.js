const Item = require('../models/Item')
const {createItemControllerError} = require('../errors/itemError')
const asyncWrapper = require('../middleware/asyncErrors.js')
const {ReasonPhrases,StatusCodes,getReasonPhrase,getStatusCode,} = require('http-status-codes')
const {deleteWithId, getWithId} = require('./functions/requestsById')

const getItems = asyncWrapper(async (req, res) => {
    const queryObject = {}
    const { category, numericFilters, sort } = req.query

    // Filter by category
    if (category) {
      queryObject.category = { $regex: category, $options: 'i' }
    }

    // Filter by operator
    if (numericFilters) {
      const operatorMap = {
        '>': '$gt',
        '>=': '$gte',
        '=': '$eq',
        '<': '$lt',
        '<=': '$lte',
      }
      const regEx = /\b(>|>=|=|<|<=)\b/g;
      let filters = numericFilters.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      )
      const options = ['price']
      filters = filters.split(',').forEach((item) => {
        const [field, operator, value] = item.split('-')
        if (options.includes(field)) {
          queryObject[field] = { [operator]: Number(value) }
        }
      })
    }

    let result = Item.find(queryObject) 

    // sort by
    if (sort) {
      const sortList = sort.split(',').join(' ')
      result = result.sort(sortList)
    } else {
      result = result.sort('title')
    }

    const items = await result

    res.status(200).json({ items: items })
})

const getItemById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params
  const item = await getWithId(Item, id, next, createItemControllerError)
  if (item){
    return res.status(StatusCodes.OK).json({ success: true, data: item })   
  }
})

const createItem = asyncWrapper(async (req, res, next) => {
    const { name, price, category} = req.body
    if (!name || !price || !category){
      return next(createItemControllerError(`All fields required!`, StatusCodes.BAD_REQUEST))
    }

    const item = await Item.create({name, price, category})
    res.status(StatusCodes.CREATED).send({ success: true, data: item })  
})

const deleteItemById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params
  const item = await deleteWithId(Item, id, next, createItemControllerError)
  if (item){
    return res.status(StatusCodes.OK).send({ success: item, itemId : id})  
  }
})

module.exports = {
    getItems, createItem, getItemById, deleteItemById
  }
  