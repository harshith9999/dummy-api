const { check } = require("express-validator");


module.exports = function demo_validator() {

    return [
        check("name")
            .notEmpty().withMessage("Please enter name").bail().isAlpha('en-US', {ignore: ' '}).withMessage("Please enter a valid name")
            .bail().isLength({ min: 4 }).withMessage("Please enter a valid name"),

        check("phone_number")
            .notEmpty().withMessage("Please enter phone number").bail()
            .isLength({ min: 10 }).withMessage("Please enter Valid Phone number"),

        check("demo_date")
            .notEmpty().withMessage("please enter demo date"),
    ];
};