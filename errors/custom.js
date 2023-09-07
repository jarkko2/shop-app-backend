class APIError extends Error {
	constructor(message,statusCode){
		super(message)
		this.statusCode = statusCode
	}
}
  
const createAPIError = (msg, statusCode) => {
	return new APIError(msg,statusCode)
}
  
module.exports = { APIError, createAPIError }
  