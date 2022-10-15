const express = require("express");
const mySQLConnection = require("../../../../../../API/connection");
const email = require("../../../../../../API/email.js");

const router = express.Router();

router.post("/getQuotes", async (req, res) => {
    const quotes = await GetQuotes();
    const users = await GetUsers();

    quotes.forEach((quote) => {
        quote.user = users.find((user) => user.id == quote.userID);

        delete quote.userID;
    });

    const json = {
        error: "null",
        quotes: quotes
    };
    res.send(json);
});

router.post("/getQuoteData", async (req, res) => {
    const uuid = req.body.uuid;

    const users = await GetUsers();
    let quote = await GetQuoteData(uuid);

    quote.user = users.find((user) => user.id == quote.userID);

    const json = {
        error: "null",
        quote: quote
    };
    res.send(json);
});

router.post("/acceptQuote", async (req, res) => {
    const uuid = req.body.uuid;
    const name = req.body.name;
    const pEmail = req.body.email;
    const setupPrice = req.body.setupPrice;

    const result = await UpdateQuoteStatus(uuid, "Accepted");

    if (result == "Success") {
        let mailOptions = {
            from: '"High-View Studios" <no-reply@high-view-studios.co.uk>', // sender address
            to: pEmail, // list of receivers
            subject: "Your Website Quote has been accepted!", // Subject line
            template: "websiteQuote/websiteQuoteAccept",
            context: {
                name: name,
                setupPrice: setupPrice
            }
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

        const users = await GetUsers();
        let quote = await GetQuoteData(uuid);

        quote.user = users.find((user) => user.id == quote.userID);

        const json = {
            error: "null",
            message: "Updated quote with Accepted",
            userMessage: "The status of this quote has been updated!",
            quoteData: quote
        };

        res.send(json);
    }
});

router.post("/declineQuote", async (req, res) => {
    const uuid = req.body.uuid;
    const name = req.body.name;
    const pEmail = req.body.email;
    const setupPrice = req.body.setupPrice;
    const reason = req.body.reason;

    const result = await UpdateQuoteStatus(uuid, "Declined");
    const rResult = await UpdateQuoteReason(uuid, reason);

    if (result == "Success" && rResult == "Success") {
        let mailOptions = {
            from: '"High-View Studios" <no-reply@high-view-studios.co.uk>', // sender address
            to: pEmail, // list of receivers
            subject: "Your Website Quote has been declined", // Subject line
            template: "websiteQuote/websiteQuoteDecline",
            context: {
                name: name,
                setupPrice: setupPrice,
                reason: reason
            }
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

        const users = await GetUsers();
        let quote = await GetQuoteData(uuid);

        quote.user = users.find((user) => user.id == quote.userID);

        const json = {
            error: "null",
            message: "Updated quote with Declined",
            userMessage: "The status of this quote has been updated!",
            quoteData: quote
        };

        res.send(json);
    }
});

//FUNCTIONS
function GetQuotes() {
    return new Promise((resolve, reject) => {
        const FIND_QUERY = "SELECT uuid, userID, total_setup, total_yearly FROM pod_websitesquotes";

        mySQLConnection.query(FIND_QUERY, (err, result) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                resolve(result);
            }
        });
    });
}

function GetUsers() {
    return new Promise((resolve, reject) => {
        const FIND_QUERY = "SELECT id, fullName, email FROM users";

        mySQLConnection.query(FIND_QUERY, (err, result) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                resolve(result);
            }
        });
    });
}

function GetQuoteData(uuid) {
    return new Promise((resolve, reject) => {
        const FIND_QUERY = "SELECT * FROM pod_websitesquotes WHERE ?";
        const data = { uuid: uuid };

        mySQLConnection.query(FIND_QUERY, data, (err, result) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                resolve(result[0]);
            }
        });
    });
}

function UpdateQuoteStatus(uuid, status) {
    return new Promise((resolve, reject) => {
        const data = [{ status: status }, uuid];
        const UPDATE_QUERY = "UPDATE pod_websitesquotes SET ? WHERE uuid=?";

        mySQLConnection.query(UPDATE_QUERY, data, (err, results) => {
            if (err) {
                reject();
            } else {
                resolve("Success");
            }
        });
    });
}

function UpdateQuoteReason(uuid, reason) {
    return new Promise((resolve, reject) => {
        const data = [{ declineReason: reason }, uuid];
        const UPDATE_QUERY = "UPDATE pod_websitesquotes SET ? WHERE uuid=?";

        mySQLConnection.query(UPDATE_QUERY, data, (err, results) => {
            if (err) {
                reject();
            } else {
                resolve("Success");
            }
        });
    });
}

module.exports = router;
