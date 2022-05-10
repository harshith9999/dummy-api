var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var DemoClass = require("../models/demoClass");
var constants_function = require("../constants/constants");
var constants = constants_function("demoClass");
var { validationResult } = require("express-validator");
var DemoClass_Validator = require("../validations/demoClass_validation");

router.get("/", async (req, res) => {
    try {
        let demoClass
        let count
        if (req.query.startDate && req.query.endDate) {
            demoClass = await demoClass.find({
                isActive: true,
                demo_date: {
                    $gte: req.query.startDate,
                    $lt: req.query.endDate
                }
            }).sort({ demo_date: 1 })
        }
        else {
            demoClass = await DemoClass.find({ isActive: true }).sort({ demo_date: 1 })
        }
        count = demoClass.length
        if (req.query.page && req.query.limit) {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const startIndex = page * limit
            const endIndex = (page + 1) * limit
            demoClass = demoClass.slice(startIndex, endIndex)
        }
        if (demoClass && demoClass.length === 0) {
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
                    "message": constants.MODELS_NOT_FOUND
                }
            });
        } else {
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 200,
                    "message": constants.SUCCESSFUL
                },
                "data": demoClass,
                "count": count
            });
        }

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

router.post('/', DemoClass_Validator(), async (req, res) => {
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
    if (!Date.parse(req.body.demo_date)) {
        return res.status(400).json({
            "status": {
                "success": false,
                "code": 400,
                "message": constants.INVALID_DATE
            }
        });
    }
    try {
        const demoClass = new DemoClass({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            phone_number: req.body.phone_number,
           demo_date: req.body.demo_date,
            message: req.body.message,
            demo_booked_date: new Date().toISOString(),
        })
        await demoClass.save()
        res.status(201).json({
            "status": {
                "success": true,
                "code": 201,
                "message": constants.MODEL_CREATE
            }
        });

    }
    catch (err) {
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

router.put("/:id", DemoClass_Validator(), async (req, res) => {
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
    if (!Date.parse(req.body.demo_date)) {
        return res.status(400).json({
            "status": {
                "success": false,
                "code": 400,
                "message": constants.INVALID_DATE
            }
        });
    }
    try {
        const id = req.params.id;
        let demoClass = await DemoClass.findOne({ _id: id, isActive: true })
        if (!demoClass) {
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {
            demoClass = await DemoClass.findByIdAndUpdate(id, req.body);
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 204,
                    "message": constants.MODEL_UPDATED
                }
            });
        }
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

router.patch("/:id", async (req, res) => {
    let body = req.body
    for (let item in body) {
        if (body[item] === '') {
            return res.status(400).json({
                "status": {
                    "success": false,
                    "code": 400,
                    "message": item + constants.EMPTY
                }
            });
        }
    }
    if (req.body.demo_date) {
        if (!Date.parse(req.body.demo_date)) {
            return res.status(400).json({
                "status": {
                    "success": false,
                    "code": 400,
                    "message": constants.INVALID_DATE
                }
            });
        }
    }
    try {
        const id = req.params.id;
        let demoClass = await DemoClass.findOne({ _id: id, isActive: true })
        if (!demoClass) {
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {
            demoClass = await DemoClass.findByIdAndUpdate(id, req.body);
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 204,
                    "message": constants.MODEL_UPDATED
                }
            });
        }
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

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const demoClass = await DemoClass.findOne({ _id: id, isActive: true });
        if (!demoClass) {
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 200,
                    "message": constants.SUCCESSFUL
                },
                "data": demoClass
            });
        }

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

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const demoClass = await DemoClass.findByIdAndUpdate(id, { isActive: false });

        if (!demoClass) {
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 204,
                    "message": constants.MODEL_DELETE
                }
            });
        }
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