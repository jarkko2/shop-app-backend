"use strict";

var ShopCart = require('../models/ShopCart');

var getItems = function getItems(req, res) {
  return regeneratorRuntime.async(function getItems$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          res.status(200).json({
            items: "working"
          });

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

var addToShoppingCart = function addToShoppingCart(req, res) {
  var owner, itemId, shopCart, shopcart;
  return regeneratorRuntime.async(function addToShoppingCart$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(req.user.username);
          owner = req.user.username;
          itemId = req.body.itemId; // Check if shopping cart exists

          _context2.next = 5;
          return regeneratorRuntime.awrap(ShopCart.find({
            owner: owner
          }));

        case 5:
          shopCart = _context2.sent;

          if (!shopCart[0]) {
            _context2.next = 11;
            break;
          }

          console.log("Found shopping cart");
          res.status(200).send({
            success: true,
            shopcart: shopCart
          });
          _context2.next = 16;
          break;

        case 11:
          console.log("Creating shopping cart");
          _context2.next = 14;
          return regeneratorRuntime.awrap(ShopCart.create({
            owner: owner,
            items: {
              itemId: itemId
            }
          }));

        case 14:
          shopcart = _context2.sent;
          res.status(201).send({
            success: true,
            shopcart: shopcart
          });

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = {
  getItems: getItems,
  addToShoppingCart: addToShoppingCart
};