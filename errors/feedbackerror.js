const { APIError } = require("./custom")

class FeedbackControllerError extends APIError {
	constructor(message,statusCode){
		super(message)
		this.statusCode = statusCode
	}
}
  
const createFeedbackControllerError = (msg, statusCode) => {
	return new FeedbackControllerError(msg,statusCode)
}
  
module.exports = { FeedbackControllerError, createFeedbackControllerError }
  