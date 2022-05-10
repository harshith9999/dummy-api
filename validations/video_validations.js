const { check } = require("express-validator");


module.exports = function video_validator() {

    return [
        check("description")
            .notEmpty().withMessage("please enter description").bail(),
        
        check("title")
            .notEmpty().withMessage("please enter title").bail(),
       
        check("url")
            .notEmpty().withMessage("please enter url").bail(),

    ];
};