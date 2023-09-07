const { createAPIError } = require('../../errors/custom')
const { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode, } = require('http-status-codes')

async function deleteWithId(Model, id, next, errorHandler) {
  // Check if item exists
  if (await getWithId(Model, id, next, errorHandler) != null) {
    return await Model.deleteOne({ _id: id })
  }
}

async function getWithId(Model, id, next, errorHandler) {
  if (!id) {
    return next(errorHandler(`ID required`, StatusCodes.BAD_REQUEST))
  }
  const item = await Model.findById(id)
  if (!item) {
    return next(errorHandler(`${ReasonPhrases.NOT_FOUND} ID: ${id}`, StatusCodes.NOT_FOUND))
  }
  return item
}

module.exports = { deleteWithId, getWithId }