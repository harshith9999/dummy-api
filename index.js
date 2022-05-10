const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require("./config/config.json");
const bodyParser = require('body-parser');
const cors = require("cors");
const fileUpload = require("express-fileupload")
const port = process.env.PORT || 4000;

app.listen(port, function () {
    console.log('Port is running in ' + port);
});
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(fileUpload());

app.use(bodyParser.json());

//MongoDb Connection :
mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, conn) {
    if (err) {
        console.log("mongodb connection error", err);
    }
    if (!err && conn) {
        console.log("mongodb connection stablished");
    }
});


const userRoute = require('./routes/user.js')
const videoRoute = require('./routes/video.js')
const contactRoute = require('./routes/contact.js')
const demoClassRoute = require('./routes/demoClass.js')


//Use API routes in the App
app.use('/', userRoute)
app.use('/video', videoRoute)
app.use('/contact', contactRoute)
app.use('/democlass', demoClassRoute)




