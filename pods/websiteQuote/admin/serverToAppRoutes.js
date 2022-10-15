const express = require("express");
const path = require("path");
const router = express.Router();

router.get(`/editItems`, (req, res) => {
    res.sendFile(path.join(__dirname, "../../../../../build", "index.html"));
});

router.get(`/quote/:uuid`, (req, res) => {
    res.sendFile(path.join(__dirname, "../../../../../build", "index.html"));
});

module.exports = router;
