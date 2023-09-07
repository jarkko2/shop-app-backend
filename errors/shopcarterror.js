const { APIError } = require("./custom")

class ShopCartControllerError extends APIError {
	constructor(message,statusCode){
		super(message)
		this.statusCode = statusCode
	}
}
  
const createShopCartControllerError = (msg, statusCode) => {
	return new ShopCartControllerError(msg,statusCode)
}
  
module.exports = { ShopCartControllerError, createShopCartControllerError }
  