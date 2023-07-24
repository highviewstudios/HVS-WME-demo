require("dotenv").config();
const express = require("express");
const mySQLConnection = require("../../../../../../API/connection");
const email = require("../../../../../../API/email");

const router = express.Router();

router.post("/accessPass", (req, res) => {
    const username = req.body.username;

    if (username == process.env.APP_KEY) {
        let mailOptions = {
            from: '"High-View Studios" <no-reply@high-view-studios.co.uk>', // sender address
            to: "shaun.evans@high-view-studios.co.uk",
            subject: "Private Pass Requested", // Subject line
            template: "accessPass"
        };
        //send mail with defined transport object
        email.mail.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            console.log("Email has been sent");
        });

        res.send("hello");
    } else {
        res.send("hello.");
    }
});

module.exports = router;
