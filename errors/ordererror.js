const { APIError } = require("./custom")

class OrderControllerError extends APIError {
	constructor(message,statusCode){
		super(message)
		this.statusCode = statusCode
	}
}
  
const createOrderControllerError = (msg, statusCode) => {
	return new OrderControllerError(msg,statusCode)
}
  
module.exports = { OrderControllerError, createOrderControllerError }
  