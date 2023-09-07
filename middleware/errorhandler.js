const errorHandler = (err, req, res, next) => {
  if (err.statusCode){
    res.status(err.statusCode).send(err.constructor.name + " : " + err.message)
  }else{
    // This is for all other errors for example undefined error
    res.status(500).send(err.message)
  }
  
}

module.exports = errorHandler