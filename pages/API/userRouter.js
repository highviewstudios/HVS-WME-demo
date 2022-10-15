const express = require("express");
const mySQLConnection = require("../../../../API/connection");

const router = express.Router();

router.post("/getOpeningData", async (req, res) => {
    const settings = await GetSettings();

    let settingsObj = {};
    settings.forEach((setting) => {
        settingsObj[setting.setting] = { value: setting.value, subValue: setting.subValue };
    });

    const json = {
        error: "null",
        settings: settingsObj
    };
    res.send(json);
});

//FUNCTIONS

function GetSettings() {
    return new Promise((resolve, reject) => {
        const FIND_QUERY = "SELECT * FROM settings";

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

module.exports = router;
