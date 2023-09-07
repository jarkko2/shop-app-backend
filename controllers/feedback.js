const Feedback = require('../models/Feedback')
const {createFeedbackControllerError} = require('../errors/feedbackerror')
const asyncWrapper = require('../middleware/asyncErrors.js')
const { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode, } = require('http-status-codes')
const { SearchWithTimeRange } = require('./functions/dateformatter')
const { SortByProperty } = require('./functions/sorting')

const { deleteWithId, getWithId } = require('./functions/requestsById')
const config = require('../utils/config')

const getFeedbacks = asyncWrapper(async (req, res, next) => {

  const { startDate, endDate, sort, replied } = req.query
  let queryObject = {}

  // If startDate or endDate is found, make sure both are defined
  if (startDate || endDate) {
    queryObject["date"] = SearchWithTimeRange(startDate, endDate, next, createFeedbackControllerError)

    // Do not continue if date is undefined => some errors happened in dateformatter
    if (queryObject["date"] == null) {
      return
    }
  }

  let result

  // sort by
  if (sort) {
    result = SortByProperty(Feedback.find(queryObject), sort)
  } else {
    // no sorting
    result = Feedback.find(queryObject)
  }



  let feedbacks = await result

  // Filter by replied
  if (replied) {
    if (replied == "true") {
      console.log("Sorting by replied")
      feedbacks = feedbacks.filter(fb => fb.reply != null)
    }
    if (replied == "false") {
      console.log("Sorting by not replied")
      feedbacks = feedbacks.filter(fb => fb.reply == null)
    }
  }

  res.status(200).json({ feedbacks: feedbacks })
})

const getFeedbackById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params
  const feedback = await getWithId(Feedback, id, next, createFeedbackControllerError)
  if (feedback) {
    return res.status(StatusCodes.OK).json({ success: true, data: feedback })
  }
})

const replyToFeedbackById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params
  const { reply } = req.body

  // Check if order exists
  if (await getWithId(Feedback, id, next, createFeedbackControllerError) != null) {
    const feedback = await Feedback.findByIdAndUpdate(id,
      [
        { $set: { reply: reply } }
      ], { returnDocument: "after" }
    )
    res.status(StatusCodes.OK).json({ feedback: feedback._id, reply: feedback.reply })
  }
})

const deleteFeedbackById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params
  const feedback = await deleteWithId(Feedback, id, next, createFeedbackControllerError)
  if (feedback) {
    return res.status(StatusCodes.OK).send({ success: feedback, itemId: id })
  }
})

const sendFeedback = asyncWrapper(async (req, res, next) => {
  const { subject, text } = req.body
  const owner = config.ENV == "test" ? req.body.username : req.user.username
  if (!text) {
    return next(createFeedbackControllerError(`Text required!`, StatusCodes.BAD_REQUEST))
  }
  const currentDate = new Date()
  console.log(currentDate)
  const feedback = await Feedback.create({ email: owner, subject: subject, text: text, date: currentDate })
  res.status(StatusCodes.CREATED).send({ success: true, data: feedback })
})

const getOwnFeedbacks = asyncWrapper(async (req, res) => {
  const owner = config.ENV == "test" ? req.body.username : req.user.username
  result = Feedback.find({ email: owner })
  const feedbacks = await result

  res.status(200).json({ feedbacks: feedbacks })
})


module.exports = {
  getFeedbacks, sendFeedback, getFeedbackById, deleteFeedbackById, getOwnFeedbacks, replyToFeedbackById
}
