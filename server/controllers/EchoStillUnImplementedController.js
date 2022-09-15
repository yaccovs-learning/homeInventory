const serverResponse = require("../utils/serverResponse");

const EchoStillUnImplementedController = (req,res) => {
    console.log(req)
    console.log(req.body)
    serverResponse(res, 200, req.body)
}

module.exports = EchoStillUnImplementedController