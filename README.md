# shop-app-backend
Example project on node.js server handling shopping items, cart, feedback and orders
Uses passport as authentication

## Features

### Docker compose
* docker compose up -d
* Runs the whole environment, shop-app-frontend, shop-app-backend and mongodb

### Shopping cart
* User can add item to shopping cart
* User can delete item from shopping cart
* User can clear shopping cart
* User can get items in shopping cart with ids or with ids and item names
* User can place order which will clear shopping cart

### Orders
* Admin can get all orders with item names and totals
* Admin can filter orders by completion state, owner and date 
* Admin can sort orders by date or some other property
* Admin can delete order by id
* Admin can toggle order completed
* Admin can toggle all orders completed
* User can get own orders with item names and totals

### Items
* User can get items by any property (Example: user can filter items by eletronics category, price lower than 500 and sort by lowest first)
* Admin can create an item to shop
* Admin can delete an item from shop
* Admin can get an item in shop

### Feedback
* User can send feedback
* User can get own feedbacks 
* Admin can get all feedbacks
* Admin can get feedback by id
* Admin can reply to feedback by id
* Admin can delete beedback by id

### Logger
* Logger saves every authentication request to logs.txt whenever it was successfull or not

### Testing
* There are 14 different tests
* Tests includes everything shop related (add item, add item to cart, place order, get orders, toggle order complete etc)

### Functions
* dateFormatter includes searching in time range, validating and formatting dates and sorting by date
* requestsById is repeating structure for deleting and getting item in any model
* itemTotal calculates total sum in order or shopping cart 
* sorting handles different sorting types, including date sorting

### Error handling
Each controller has its own error handler which will be showed in error messages. This will help to find where did the error occur, even though it is kind of obvious to developer. This was made as learning purpose and if user sends a report. User reports would be much easier to deal with, instead of "ID: 2398asfjkalj35 not found" message, developer would have for example "404, UserController: ID: 2398asfjkalj35 not found".

### Database
* MongoDB was used as database, nothing special on there since models etc are created by app
* .env variables used are in .env.example