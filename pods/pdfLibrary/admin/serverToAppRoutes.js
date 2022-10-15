const express = require("express");
const path = require("path");
const router = express.Router();

router.get(`/upload`, (req, res) => {
    res.sendFile(path.join(__dirname, "../../../../../build", "index.html"));
});

router.get(`/modify/:id`, (req, res) => {
    res.sendFile(path.join(__dirname, "../../../../../build", "index.html"));
});

module.exports = router;
