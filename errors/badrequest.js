const { APIError } = require("./custom")

class BadRequestError extends APIError {
	constructor(message,statusCode){
		super(message)
		this.statusCode = statusCode
	}
}
  
const createBadRequestError = (msg, statusCode) => {
	return new BadRequestError(msg,statusCode)
}
  
module.exports = { BadRequestError, createBadRequestError }
  