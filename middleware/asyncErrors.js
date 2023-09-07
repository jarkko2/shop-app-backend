const asyncWrapper = (fn) => {
    // argument fn is the controller that we are wrapping
    // the wrapper returns another function,
    // req, res and next are coming from Express and they are passed down to the returned function
    // the returned function is async, so we can await the controller function inside try...catch
    return async (req,res,next) => {
      try {
        // req, res and next are passed down to the controller
        await fn(req,res,next)
      } catch (error) {
        // Passing any error to the next middleware
        next(error)
      }
    }
  }
  
  module.exports = asyncWrapper
  