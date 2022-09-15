const serverResponse = require("../utils/serverResponse");

const EchoController = (req,res) => {
    console.log(req)
    console.log(req.body)
    serverResponse(res, 200, req.body)
}

module.exports = EchoController