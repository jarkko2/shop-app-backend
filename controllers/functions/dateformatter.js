const { createAPIError } = require('../../errors/custom')
const { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode, } = require('http-status-codes')

function SearchWithTimeRange(startDate, endDate, next, errorHandler) {
    if (!startDate || !endDate) {
        return next(errorHandler(`Start and end dates required`, StatusCodes.BAD_REQUEST))
    } else {
        const dates = ValidateAndFormatDate(startDate, endDate, next, errorHandler)
        // Return if dates is not null, otherwise some error happened in validation
        if (dates) {
            const startDateFormat = dates.startDateFormat
            const endDateFormat = dates.endDateFormat

            return {
                // Months are reduced by 1 since months go from 0-11
                $gte: new Date(parseInt(startDateFormat[0]), (parseInt(startDateFormat[1]) - 1), parseInt(startDateFormat[2])),
                $lt: new Date(parseInt(endDateFormat[0]), (parseInt(endDateFormat[1]) - 1), parseInt(endDateFormat[2]))
            }
        }

    }
}

function ValidateAndFormatDate(startDate, endDate, next, errorHandler) {
    startDateFormat = []
    endDateFormat = []
    startDateFormat = startDate.split('-')
    endDateFormat = endDate.split('-')

    // Check if date arrays has 3 items for a date
    if (startDateFormat.length < 3 || endDateFormat.length < 3) {
        return next(errorHandler(`Invalid date, use YYYY-MM-DD format`, StatusCodes.BAD_REQUEST))
    }
    // Check if date is formatted correctly
    if (!IsValidDate(Date.parse(startDate)) || !IsValidDate(Date.parse(endDate))) {
        return next(errorHandler(`Date parsing failed, use YYYY-MM-DD format`, StatusCodes.BAD_REQUEST))
    }

    //return [startDateFormat, endDateFormat]
    return {
        startDateFormat,
        endDateFormat
    };
}

function IsValidDate(date) {
    if (isNaN(date)) {
        return false;
    }
    return true
}

module.exports = { ValidateAndFormatDate, SearchWithTimeRange }