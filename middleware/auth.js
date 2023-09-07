const { createBadRequestError } = require('../errors/badrequest')
const User = require('../models/User')
const { Role } = require("../enums/roles")
const {ReasonPhrases,StatusCodes,getReasonPhrase,getStatusCode,} = require('http-status-codes')
const {LogActivity} = require("../controllers/logger")
const config = require('../utils/config')

const signInRequired = async (req, res, next) => {
  // Skip authentication if testing
  if (config.ENV == "test") {
    return next()
  }
  if (req.user == null) {
    LogActivity(req, false, "SIGN_IN_REQUIRED_USER")
    return next(createBadRequestError(`Not signed in!`, StatusCodes.UNAUTHORIZED))
  }
  LogActivity(req, true,"PERMISSION_SUCCESS_USER")
  next()
}
const adminRequired = async (req, res, next) => {
  // Skip authentication if testing
  if (config.ENV == "test") {
    return next()
  }
  if (req.user == null) {
    LogActivity(req, false,"SIGN_IN_REQUIRED_ADMIN")
    return next(createBadRequestError(`Not signed in!`, StatusCodes.UNAUTHORIZED))
  }
  const user = await User.find({ email: req.user.username })

  if (user[0].role != Role.Admin) {
    LogActivity(req, false,"PERMISSION_ADMIN_DENIED")
    return next(createBadRequestError(`You don't have permission`, StatusCodes.UNAUTHORIZED))
  }
  LogActivity(req, true,"PERMISSION_ADMIN_SUCCESS")
  next()
}

module.exports = { signInRequired, adminRequired }
