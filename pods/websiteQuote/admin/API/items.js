const express = require("express");
const mySQLConnection = require("../../../../../../API/connection");

const router = express.Router();

router.post("/getCategories", async (req, res) => {
    const categories = await GetCategories();
    const list = [];

    categories.forEach((category) => {
        if (!list.includes(category.category)) {
            list.push(category.category);
        }
    });

    const json = {
        error: "null",
        categories: list
    };

    res.send(json);
});

router.post("/getCategoryItems", async (req, res) => {
    const category = req.body.category;

    const items = await GetCategoryItems(category);

    const json = {
        error: "null",
        items: items
    };
    res.send(json);
});

router.post("/updateData", async (req, res) => {
    const items = req.body.items;
    const values = req.body.values;
    const quantities = req.body.quantities;
    const category = req.body.category;

    items.forEach(async (item) => {
        if (item.dataType == "price") {
            const price = parseFloat(values[`item${item.id}`]).toFixed(2);
            await UpdatePrice(item.serverUuid, price.toString(), quantities[`item${item.id}`]);
        } else {
            await UpdateData(item.serverUuid, values[`item${item.id}`], quantities[`item${item.id}`]);
        }
    });

    const newItems = await GetCategoryItems(category);

    const json = {
        error: "null",
        message: "Entries successfully updated!",
        items: newItems
    };

    res.send(json);
});

//FUCTIONS
function GetCategories() {
    return new Promise((resolve, reject) => {
        const FIND_QUERY = "SELECT category FROM pod_websiteitems";

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

function GetCategoryItems(category) {
    return new Promise((resolve, reject) => {
        const FIND_QUERY = "SELECT uuid, item, data, unitPrice, dataType , quantity FROM pod_websiteitems WHERE ?";
        const data = { category: category };

        mySQLConnection.query(FIND_QUERY, data, (err, result) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                resolve(result);
            }
        });
    });
}

function UpdatePrice(uuid, entry, quantity) {
    return new Promise((resolve, reject) => {
        const data = [{ unitPrice: entry, quantity: quantity }, uuid];
        const UPDATE_QUERY = "UPDATE pod_websiteitems SET ? WHERE uuid=?";

        mySQLConnection.query(UPDATE_QUERY, data, (err, results) => {
            if (err) {
                reject();
            } else {
                resolve("Success");
            }
        });
    });
}

function UpdateData(uuid, entry, quantity) {
    return new Promise((resolve, reject) => {
        const data = [{ data: entry, quantity: quantity }, uuid];
        const UPDATE_QUERY = "UPDATE pod_websiteitems SET ? WHERE uuid=?";

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
