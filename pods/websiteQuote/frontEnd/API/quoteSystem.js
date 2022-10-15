const express = require("express");
const mySQLConnection = require("../../../../../../API/connection");
const email = require("../../../../../../API/email.js");
const moment = require("moment");

const router = express.Router();

router.post("/getItems", async (req, res) => {
    const items = await GetItems();

    const hostingTypes = items.filter((item) => item.category == "Website Type");
    const setupFees = items.filter((item) => item.category == "Setup");
    const domainName = items.filter((item) => item.category == "Domain Names");
    const emailAccounts = items.filter((item) => item.category == "Email Accounts");
    const sslCertificate = items.filter((item) => item.category == "SSL Certificate");
    const location = items.filter((item) => item.category == "Location");

    const json = {
        error: "null",
        hostingTypes: hostingTypes,
        setupFees: setupFees,
        domainName: domainName,
        emailAccounts: emailAccounts,
        sslCertificate: sslCertificate,
        location: location
    };
    res.send(json);
    //res.send(json);
});

router.post("/submitQuote", async (req, res) => {
    const values = req.body.values;
    const uPrices = req.body.uPrices;
    const quantities = req.body.quantities;
    const prices = req.body.prices;
    const totals = req.body.totalPrices;

    const details = req.body.details;
    let userID = "";

    const date = moment().format("DD/MM/YYYY");

    const user = await GetUserByEmail(details.email);

    if (user == null) {
        userID = await InsertUser(details.name, details.email, date);
    } else {
        userID = user.id;
    }

    const data = {
        ...values,
        ...uPrices,
        ...quantities,
        ...prices,
        ...totals,
        userID: userID.toString(),
        additionalInfo: details.additionalInfo,
        date: date,
        status: "waiting",
        ticketUUID: "null"
    };

    const result = await InsertNewWebsiteQuote(data);

    const emailAccountsMonthlyPrice = parseFloat(uPrices.uPrice_emailAccounts) * parseFloat(values.value_emailAccounts);

    if (result.message == "Success") {
        let mailOptions = {
            from: '"High-View Studios" <no-reply@high-view-studios.co.uk>', // sender address
            to: process.env.SUPER_EMAIL, // list of receivers
            subject: "You have recieved a new Website Quote", // Subject line
            template: "websiteQuote/websiteQuoteEmail",
            context: {
                hostingTypesItem: values.value_webType,
                hostingTypesUnitPrice: uPrices.uPrice_webType,
                hostingTypesQuantity: quantities.q_webType,
                hostingTypesPrice: prices.price_webType,
                setupItem: `${values.value_webType} Setup`,
                setupUnitPrice: uPrices.uPrice_setup,
                setupQuantity: quantities.q_setup,
                setupPrice: prices.price_setup,
                domainNameItem: values.value_domainName,
                domainNameUnitPrice: uPrices.uPrice_domainName,
                domainNameQuantity: quantities.q_domainName,
                domainNamePrice: prices.price_domainName,
                emailAccountsItem: values.value_emailAccounts,
                emailAccountsMonthlyPrice: emailAccountsMonthlyPrice.toFixed(2),
                emailAccountsUnitPrice: `(£${uPrices.uPrice_emailAccounts} x ${values.value_emailAccounts})`,
                emailAccountsQuantity: quantities.q_emailAccounts,
                emailAccountsPrice: prices.price_emailAccounts,
                sslCertItem: values.value_sslCert,
                sslCertUnitPrice: uPrices.uPrice_sslCert,
                sslCertQuantity: quantities.q_sslCert,
                sslCertPrice: prices.price_sslCert,
                locationItem: values.value_location,
                locationUnitPrice: uPrices.uPrice_location,
                locationQuantity: quantities.q_location,
                locationPrice: prices.price_location,
                setupTotal: totals.total_setup,
                yearlyTotal: totals.total_yearly,
                detailsName: details.name,
                detailsEmail: details.email,
                detailsAddInfo: details.additionalInfo
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

        const json = {
            error: "null",
            message: "Inserted website quote"
        };
        res.send(json);
    } else {
        const json = {
            error: "Yes",
            message: "Failed to insert website quote"
        };
        res.send(json);
    }
});

//FUNCTIONS
function GetItems() {
    return new Promise((resolve, reject) => {
        const FIND_QUERY = "SELECT * FROM pod_websiteitems";

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

function InsertNewWebsiteQuote(data) {
    return new Promise(async (resolve, reject) => {
        const query = "INSERT pod_websitesquotes SET ?";
        mySQLConnection.query(query, data, (err, result) => {
            if (err) {
                console.log(err);
                const json = {
                    message: "Error",
                    result: err
                };
                reject(json);
            } else {
                const json = {
                    message: "Success",
                    result: result.insertId
                };
                resolve(json);
            }
        });
    });
}

function GetUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const data = { email: email };
        const SELECT_QUERY = "SELECT id, fullName, email FROM users WHERE ?";

        mySQLConnection.query(SELECT_QUERY, data, (err, results) => {
            if (err) {
                reject();
            } else {
                resolve(results[0]);
            }
        });
    });
}

function InsertUser(name, pEmail, date) {
    return new Promise(async (resolve, reject) => {
        const data = {
            fullName: name,
            email: pEmail,
            registered: "false",
            new: "false",
            type: "",
            requestedPassword: "false",
            emailConfirmed: "false",
            date: date
        };
        const query = "INSERT users SET ?";
        mySQLConnection.query(query, data, (err, result) => {
            if (err) {
                console.log(err);
                const json = {
                    message: "Error",
                    result: err
                };
                reject(json);
            } else {
                resolve(result.insertId);
            }
        });
    });
}

module.exports = router;
