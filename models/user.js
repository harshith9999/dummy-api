var mongoose = require("mongoose");
const bcrypt = require("bcrypt");

var userSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    
    email: {
        type: String,
        unique: [true, "email already exists"],
        required: [true, "please enter email address"],
        lowercase: [true, "email address must be lowercase"],
        validate: [
            {
                validator: function(v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                Error: "please enter a valid email address"
            }
        ]
    },

    mobile_number: {
        type: Number,
        required: [true, "please enter phone number"],
        validate: [
            {
                validator: function (v) {
                    return /^[6-9]\d{9}$/.test(v);
                },
                message: "please enter a valid indian phone number"
            }
        ]
    },

    password: {
        type: String,
        required: [true, "please enter password"],
        validate: [
            {
                validator: function(v) {
                    return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(v);
                },
                Error: "invalid password, password must contain 8 characters and include one lowercase, one uppercase, one number"
            }
        ]
    },

    first_name : {
        type: String,
        required: true,
        min: [4, "name should be minimum 4 characters"]
    },

    last_name: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        default:"user",
    }
});

userSchema.pre('save', async function (next) {
    const user = this
   let hash = await bcrypt.hash(user.password, 8);
   user.password=hash
    next()
})


module.exports = mongoose.model("User", userSchema);