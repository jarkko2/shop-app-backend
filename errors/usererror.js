const { APIError } = require("./custom")

class UserControllerError extends APIError {
	constructor(message,statusCode){
		super(message)
		this.statusCode = statusCode
	}
}
  
const createUserControllerError = (msg, statusCode) => {
	return new UserControllerError(msg,statusCode)
}
  
module.exports = { UserControllerError, createUserControllerError }
  