const mongoose = require('mongoose')
const supertest = require('supertest')
const Item = require('../models/Item')
const ShopCart = require('../models/ShopCart')
const Order = require('../models/Order')
const Feedback = require('../models/Feedback')
const testItems = require('./data.json')
const app = require('../app')
const api = supertest(app)

beforeAll(async () => {
    await Item.deleteMany({})
    await Item.create(testItems)
    await Feedback.deleteMany({})
    await ShopCart.deleteMany({})
    await Order.deleteMany({})
})

test('items returned as json with length of 6', async () => {

    await api
        .get('/api/items')
        .expect('Content-Type', /application\/json/)
        .expect(200)
    const response = await api.get('/api/items')
    expect(response.body.items).toHaveLength(6)
})

test('a new item can be added ', async () => {

    const newItem = {
        "name": "Large sofa",
        "price": 449.99,
        "category": "furniture"
    }

    await api
        .post('/api/items')
        .send(newItem)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/items')
    expect(response.body.items).toHaveLength(testItems.length + 1)
})

test('a second new item can be added ', async () => {

    const newItem = {
        "name": "Sofa",
        "price": 449.99,
        "category": "furniture"
    }

    await api
        .post('/api/items')
        .send(newItem)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/items')
    expect(response.body.items).toHaveLength(testItems.length + 2)
})

test('item can be deleted ', async () => {
    const response = await api.get('/api/items')
    const firstDocumentId = response.body.items[0]._id
    await api
        .delete(`/api/items/${firstDocumentId}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('item count has decreased', async () => {
    const response = await api.get('/api/items')
    expect(response.body.items).toHaveLength(testItems.length + 1)
})

test('item can be added to shopping cart ', async () => {

    const firstId = await api.get('/api/items')
    const firstDocumentId = firstId.body.items[0]._id
    const response = await api
        .post(`/api/shoppingcart/`)
        .send({ itemId: firstDocumentId, username: "testman@tester.com" })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    // Item is in the shopping cart
    expect(response.body.shopcart.items).toHaveLength(1)
    //return new Promise((r) => setTimeout(r, 2000));
})

test('order can be made', async () => {
    const response = await api
        .post(`/api/shoppingcart/order`)
        .send({username: "testman@tester.com" })
        .expect(201)
        .expect('Content-Type', /application\/json/)
    expect(response.body.order.owner).toBe("testman@tester.com")
})

test('orders can be found', async () => {
    const response = await api
        .get(`/api/orders/admin`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
   
    expect(response.body.orders).toHaveLength(1)
})

test('order can be toggled', async () => {
    const orders = await api.get(`/api/orders/admin`)
    expect(orders.body.orders).toHaveLength(1)

    const response = await api
        .post(`/api/orders/admin/`+mongoose.Types.ObjectId(orders.body.orders[0].Id))
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body.completed).toBe(true)
})

test('all orders can be toggled', async () => {
    const response = await api
        .post(`/api/orders/admin`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})


test('order can be deleted', async () => {
    const orders = await api.get(`/api/orders/admin`)
    expect(orders.body.orders).toHaveLength(1)
    
    const response = await api
        .delete(`/api/orders/admin/`+mongoose.Types.ObjectId(orders.body.orders[0].Id))
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('feedback can be sent', async () => {
    const response = await api
        .post(`/api/feedback`)
        .send({username:"testman@tester.com" , subject : "Test working subject", text: "Test working text"})
        .expect(201)
        .expect('Content-Type', /application\/json/)
})

test('feedbacks can be found', async () => {
    const response = await api
        .get(`/api/feedback/admin`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
   
    expect(response.body.feedbacks).toHaveLength(1)
})

test('feedback can be deleted', async () => {
    const feedbacks = await api.get(`/api/feedback/admin`)
    expect(feedbacks.body.feedbacks).toHaveLength(1)

    const response = await api
        .delete(`/api/feedback/admin/`+mongoose.Types.ObjectId(feedbacks.body.feedbacks[0]._id))
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

afterAll(async () => {
    mongoose.connection.close()
})
