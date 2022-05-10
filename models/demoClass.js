var mongoose = require("mongoose");

var demoClassSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    name: {
        type: String,
        required: [true, "please enter  name"],
        min: [4, "name should be minimum 4 characters"]
    },

    phone_number: {
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

    demo_date: {
        type: String,
        required: [true, "please enter appointment_date"],
    },

    demo_booked_date: {
        type: String,
        required: true,
    },

    message: {
        type: String,
        required: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },

});



module.exports = mongoose.model("DemoClass", demoClassSchema);