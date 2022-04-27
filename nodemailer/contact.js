const nodemailer = require("nodemailer");
const config = require("../config/config.json");
const {google}=require("googleapis")

const oAuth2Client=new google.auth.OAuth2(config.CLIENT_ID,config.CLIENT_SECRET,config.REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:config.REFRESH_TOKEN})

const sendEmail = async (body) => {
    try {
        const accessToken=await oAuth2Client.getAccessToken()

        const transporter = nodemailer.createTransport({
            host: 'http://localhost:4000',
            service: 'gmail',
            secure: true,
            auth: {
                type:"OAuth2",
                user: config.EMAIL,
                clientId: config.CLIENT_ID,
                clientSecret:config.CLIENT_SECRET,
                refreshToken:config.REFRESH_TOKEN,
                accessToken:accessToken
            },
        });

        await transporter.sendMail({
            from: config.EMAIL,
            to: "harshiith.p@gmail.com",
            subject: 'Queries',
            text: 'New User',
            html: `<br>         
                    <b> <table>         
                    <tr><td>Name</td><td>${body.name}</td></tr>        
                    <tr><td>Email</td><td>${body.email}</td></tr>        
                    <tr><td>Message</td><td>${body.message}</td></tr>         
                    </table> </b> `
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};

module.exports = sendEmail;