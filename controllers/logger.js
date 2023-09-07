const fs = require("fs");
let stringify = require('json-stringify-safe');

function LogActivity(req, success, roleLevel) {
    const url = req.protocol + '://' + req.get('host') + req.originalUrl
    const method = req.method
    const params = req.params
    const query = req.query
    const body = req.body
    const date = new Date()
    const user = req.user ? req.user.username : "not_signed_in"
    const stringToWrite = 
    "\n["+ roleLevel +"]"+
    "\nPermission success: " + success + " for: " + user +  "\n    " + 
    stringify(method) + " : " +stringify(url) +
     "\n    params: "+ stringify(params) + 
     "\n    query: " + stringify(query) + 
     "\n    body: " + stringify(body) + 
     "\n    Date: " + date +"\n"

    fs.appendFile("./logs.txt", stringToWrite, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })
}

module.exports = { LogActivity }