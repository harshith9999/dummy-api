var express = require("express");
var router = express.Router();
var sendEmail = require("../nodemailer/contact.js")
var constants_function = require("../constants/constants");
var constants = constants_function("contact");

router.post("/", async (req, res) => {
    try {
        sendEmail(req.body);
        res.status(200).json({
            "status": {
                "success": true,
                "code": 200,
                "message": constants.SUCCESSFUL
            },
        });
    }
    catch (err) {
        res.status(500).json({
            "status": {
                "success": true,
                "code": 500,
                "message": err.msg
            },
        });
    }
})


module.exports = router;