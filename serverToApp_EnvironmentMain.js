const express = require("express");
const path = require("path");
const router = express.Router();

//MAIN PAGES
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../build", "index.html"));
});

router.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../../build", "index.html"));
});

router.get("/viewHelp", (req, res) => {
  res.sendFile(path.join(__dirname, "../../build", "index.html"));
});

router.get("/contactUs", (req, res) => {
  res.sendFile(path.join(__dirname, "../../build", "index.html"));
});

router.get("/appDevelopment", (req, res) => {
  res.sendFile(path.join(__dirname, "../../build", "index.html"));
});

router.get("/webDevelopment", (req, res) => {
  res.sendFile(path.join(__dirname, "../../build", "index.html"));
});

module.exports = router;
