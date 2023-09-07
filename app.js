require('dotenv').config()
const express = require('express')
var cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5001
const { MONGO_URI } = process.env
const { SESSION_SECRET } = process.env

const passport = require('passport')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const connectMongoDB = require('./db/mongodb')

// Routes
const items = require('./routes/items')
const users = require('./routes/users')
const shoppingcart = require('./routes/shoppingcart')
const orders = require('./routes/orders')
const feedback = require('./routes/feedback')

// config 
const config = require('./utils/config')

// Allow requests from http://localhost:3000 (your frontend)
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true, // Set to allow cookies and other credentials
};

app.use(cors(corsOptions));

const errorHandler = require('./middleware/errorhandler')

// parse form data
app.use(express.urlencoded({ extended: false }))
// parse json
app.use(express.json())

// User authentication
app.use(session({
  secret: SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoDBStore({
    uri: config.MONGODB_URI,
    collection: 'passport-sessions',
  }),
   cookie: { secure: false }
}))

app.use(passport.authenticate('session'))

app.use('/api/users', users)
app.use('/api/items', items)
app.use('/api/shoppingcart', shoppingcart)
app.use('/api/orders', orders)
app.use('/api/feedback', feedback)

app.use(errorHandler)

connectMongoDB(config.MONGODB_URI)

module.exports = app