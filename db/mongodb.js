const mongoose = require('mongoose')

const connectMongoDB = (url) => {
  console.log("Connecting to " + url)

  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("Successfully connected to the DB");
  }).catch((e) => {
    console.log(e);
  });

}

module.exports = connectMongoDB
