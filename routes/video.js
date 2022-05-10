var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Video = require("../models/video");
var constants_function = require("../constants/constants");
var constants = constants_function("video");
const auth = require('../check_authorization/user_authorization');
var { validationResult } = require("express-validator");
var Video_Validator = require("../validations/video_validations");

router.post('/file-upload', async (req, res) => {
    req.files.file.mv('public/' + req.body.id + '.pdf', (error) => {
        if (error) {
            res.status(400).json({
                "status": {
                    "success": true,
                    "code": 400,
                    "message": "file upload" + constants.UN_SUCCESSFUL
                },
            });
        }
        else {
            res.status(200).json({
                "status": {
                    "success": true,
                    "code": 200,
                    "message": constants.SUCCESSFUL
                },
            });
        }
    })
})

router.get('/download/:id', (req, res) => {
    const id = req.params.id;
    res.download('public/'+id+'.pdf');
});

router.get('/', auth, async (req, res) => {
    try {
        let videos = await Video.find({ isActive: true });
        const count = videos.length
        if (videos && videos.length === 0) {
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
                "data": videos,
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

router.post('/', Video_Validator(), async (req, res) => {
    try {
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
        const video = new Video({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        })
        await video.save()
        res.status(201).json({
            "status": {
                "success": true,
                "code": 201,
                "message": constants.MODEL_CREATE
            },
            "id": video._id
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

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let video = await Video.findOne({ _id: id, isActive: true })
        if (!video) {
            res.status(404).json({
                "status": {
                    "success": false,
                    "code": 404,
                    "message": constants.MODEL_NOT_FOUND
                }
            });
        } else {
            video = await Video.findByIdAndUpdate(id, req.body);
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
        const video = await Video.findOne({ _id: id, isActive: true });
        if (!video) {
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
                "data": video
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
        const video = await Video.findByIdAndUpdate(id, { isActive: false });

        if (!video) {
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
