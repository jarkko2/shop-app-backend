const { APIError } = require("./custom")

class ItemControllerError extends APIError {
	constructor(message,statusCode){
		super(message)
		this.statusCode = statusCode
	}
}
  
const createItemControllerError = (msg, statusCode) => {
	return new ItemControllerError(msg,statusCode)
}
  
module.exports = { ItemControllerError, createItemControllerError }
  