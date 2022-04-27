const { check } = require("express-validator");


module.exports = function user_validator() {

    return [
        check("first_name")
            .notEmpty().withMessage("Please enter First name").bail().isAlpha('en-US', {ignore: ' '}).withMessage("Please enter a valid First name")
            .bail().isLength({ min: 4 }).withMessage("Please enter a Valid First name"),
            
        check("last_name")
            .notEmpty().withMessage("please enter assigned to").bail(),

        check("email")
            .isEmail().withMessage("Please enter Valid Email").bail(),

        check("mobile_number")
            .notEmpty().withMessage("Please enter phone number").bail()
            .isLength({ min: 10 }).withMessage("Please enter Valid Mobile number"),

        check("password")
        .isLength({ min: 8 })
        .withMessage('invalid password, password must contain 8 characters')
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
        .withMessage('invalid password, password must  include one lowercase, one uppercase, one number').bail(),

    ];
};