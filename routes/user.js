var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var User = require("../models/user");
var config = require("../config/config.json");
var { validationResult } = require("express-validator");
const auth = require('../check_authorization/user_authorization');
var constants_function = require("../constants/constants");
var constants = constants_function("user");
var User_Validator = require("../validations/user_validations");

router.get('/', function(req, res) {
    res.send("Ok");
  });

router.post('/signup', User_Validator(), async (req, res) => {
    try {
        const usercheck = await User.find({ email: req.body.email })
        if (usercheck.length != 0) {
            return res.status(400).json({
                "status": {
                    "success": false,
                    "code": 400,
                    "message": constants.EXISTED_USER
                }
            });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                "status": {
                    "success": false,
                    "code": 400,
                    "message": errors.array()[0].msg
                }
            });
        }
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        })
        await user.save()
        res.status(201).json({
            "status": {
                "success": true,
                "code": 201,
                "message": constants.MODEL_CREATE
            }
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            "status": {
                "success": false,
                "code": 500,
                "message": err.message
            }
        });
    }
})
//POST Request for Login :
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        //Finding Admin with username :
        const user = await User.find({ email: email });

        //Returning Error if Admin Not Found
        if (user.length < 1) {
            return res.status(401).json({
                "status": {
                    "success": false,
                    "code": 401,
                    "message": constants.AUTHORIZATION_FAILED
                }
            });
        }

        //Comparing Hashed Password Using Bcrypt :
        bcrypt.compare(password, user[0].password, (err, result) => {

            //Returning Error If Match Not Found
            if (err) {
                return res.status(401).json({
                    "status": {
                        "success": false,
                        "code": 401,
                        "message": constants.AUTHORIZATION_FAILED
                    }
                });
            }

            //Creating token If Match Found :
            if (result) {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    config.USER_JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );

                //Response :
                return res.status(200).json({
                    "status": {
                        "success": true,
                        "code": 200,
                        "message": constants.AUTHORIZATION_SUCCESFUL
                    },
                    token: token
                });
            }

            //Response for Error :
            res.status(401).json({
                "status": {
                    "success": false,
                    "code": 401,
                    "message": constants.AUTHORIZATION_FAILED
                }
            });
        });

        //Error Catching :
    } catch (err) {
        console.log(err);
        res.status(500).json({
            "status": {
                "success": false,
                "code": 500,
                "message": err.message
            }
        });
    }
});



module.exports = router;