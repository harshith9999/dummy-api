var mongoose = require("mongoose");

var videoSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    description : {
        type: String,
        required: true,
    },

    title: {
        type: String, 
        required: true,
    },

    url:{
        type: String, 
        required: true,
    },
    
    isActive:{
        type: Boolean, 
        default:true
    }
});

module.exports = mongoose.model("Video", videoSchema);