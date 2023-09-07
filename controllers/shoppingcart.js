const ShopCart = require('../models/ShopCart')
const Order = require('../models/Order')
var mongoose = require('mongoose');
const asyncWrapper = require('../middleware/asyncErrors.js')
const {createAPIError} = require('../errors/custom')
const {createShopCartControllerError} = require('../errors/shopcarterror')
const {ReasonPhrases,StatusCodes,getReasonPhrase,getStatusCode,} = require('http-status-codes')
const config = require('../utils/config');
const { update } = require('../models/User');

const { getTotal } = require('./functions/itemTotal')

const getItems = asyncWrapper(async (req, res, next) => {
    const owner = req.user.username
    const shopCart = await ShopCart.find({owner:owner})
    if (shopCart[0]){
        res.status(StatusCodes.OK).json({ items: shopCart[0].items })
    }else{
        
        return next(createShopCartControllerError(`${owner} does not have shopping cart`, StatusCodes.BAD_REQUEST))
    }
    
})

const getItemsWithNames = asyncWrapper(async (req, res) => {
    const owner = req.user.username
    const shopCart = await ShopCart.find({owner:owner}).populate('items', { name: 1 , price: 1})

    const total = getTotal(shopCart[0].items)

    res.status(StatusCodes.OK).json({ items: shopCart[0].items, total: total })
})

const addToShoppingCart = asyncWrapper(async (req, res, next) => {
    const owner = config.ENV == "test" ? req.body.username : req.user.username

    const { itemId } = req.body
    // Check if shopping cart exists
    const shopCart = await ShopCart.find({owner:owner})

    const stringToId = mongoose.Types.ObjectId(itemId)
    // If exists
    if (shopCart[0])
    {
        console.log("Found shopping cart")
        
        const shopcart = await ShopCart.findOneAndUpdate({owner:owner},{$push:{items:stringToId} }, {returnDocument: "after"})
        res.status(StatusCodes.CREATED).send({ success: true, shopcart: shopcart })
    }
    // Else create shopping cart
    else
    {
        console.log("Creating shopping cart with "+ stringToId)
        const shopcart = await ShopCart.create({owner:owner, items:stringToId})
        res.status(StatusCodes.CREATED).send({ success: true, shopcart: shopcart })  
        
    }
})

const removeFromShoppingCart = asyncWrapper(async (req, res, next) => {
    const owner = config.ENV == "test" ? req.body.username : req.user.username
    const { id } = req.params
    const shopCart = await ShopCart.find({owner:owner})

    // If exists
    if (shopCart[0])
    {
        let items = await shopCart
        let updatedItems = []
        let deletionDone = false
        console.log(items[0].items)
        for (let i = 0; i < items[0].items.length; i++) {
            // Prevent adding once when ID matches
            // Can't use filter since then same ID items will be removed
            if (items[0].items[i] == id && !deletionDone){
                deletionDone = true
            }
            else
            {
                updatedItems.push(items[0].items[i])
            }
        }

        console.log(updatedItems)

        const shopcart = await ShopCart.findOneAndUpdate(
            {owner:owner},
            {$set : {items: updatedItems}},
            {returnDocument: "after"}
        )

        res.status(StatusCodes.CREATED).send({ success: true, shopcart: shopcart })
    }
    // Else return error
    else
    {
        return next(createShopCartControllerError(`${owner} does not have shopping cart`, StatusCodes.BAD_REQUEST))  
    }
})

const removeAllFromShoppingCart = asyncWrapper(async (req, res, next) => {
    const owner = config.ENV == "test" ? req.body.username : req.user.username
    const { id } = req.params
    const shopCart = await ShopCart.find({owner:owner})

    // If exists
    if (shopCart[0])
    {
        let items = await shopCart
        const updatedItems = items[0].items.filter(item => item != id);
        const shopcart = await ShopCart.findOneAndUpdate(
            {owner:owner},
            {$set : {items: updatedItems}},
            {returnDocument: "after"}
        )
        res.status(StatusCodes.CREATED).send({ success: true, shopcart: shopcart })
    }
    // Else return error
    else
    {
        return next(createShopCartControllerError(`${owner} does not have shopping cart`, StatusCodes.BAD_REQUEST))  
    }
})

const placeOrder = asyncWrapper(async (req, res, next) => {
    // Get user
    const owner = config.ENV == "test" ? req.body.username : req.user.username

    // Check if shopping cart exists

    const shopCart = await ShopCart.find({owner:owner})

    //console.log(shopCart[0].items)
    // If exists
    if (shopCart[0])
    {
        if (shopCart[0].items.length > 0)
        {
            console.log("Found shopping cart with items")
            const order = await Order.create({owner:owner, items: shopCart[0].items, date: new Date() })
            const shopcart = await ShopCart.updateOne({owner:owner},{items:[] },{completed:false})
            res.status(StatusCodes.CREATED).send({ success: true, order: order, shopcart: shopcart })
        }
        else
        {
            return next(createShopCartControllerError(`There is no items in shopping cart!`, StatusCodes.BAD_REQUEST))  
        }
    }
    // Else return error
    else
    {
        return next(createShopCartControllerError(`${owner} does not have shopping cart`, StatusCodes.BAD_REQUEST))  
    }  
})

const clearCart = asyncWrapper(async(req, res, next) => {
    // Get user
    const owner = config.ENV == "test" ? req.body.username : req.user.username

    // Check if shopping cart exists
    const shopCart = await ShopCart.find({owner:owner})

    // If exists
    if (shopCart[0])
    {
        if (shopCart[0].items.length > 0)
        {
            console.log("Found shopping cart with items")
            const shopcart = await ShopCart.updateOne({owner:owner},{items:[] },{completed:false}).then(
                shopcart => res.status(StatusCodes.OK).send({ success: true, shopcart: shopcart })               
            )
            
        }
        else
        {
            return next(createShopCartControllerError(`There is no items in shopping cart!`, StatusCodes.BAD_REQUEST))  
        }
    }
    // Else return error
    else
    {
        return next(createShopCartControllerError(`${owner} does not have shopping cart`, StatusCodes.BAD_REQUEST))  
    }  
})

module.exports = { getItems, addToShoppingCart, placeOrder, clearCart, getItemsWithNames, removeFromShoppingCart, removeAllFromShoppingCart}