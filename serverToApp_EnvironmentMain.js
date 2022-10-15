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

//PODS
const pdfLibraryAdminRoutes = require("./pods/pdfLibrary/admin/serverToAppRoutes");
router.use(`/admin-${process.env.REACT_APP_ADMINCODE}/features/pod/CPOD_PDFLIBRARY_ADMIN`, pdfLibraryAdminRoutes);

const websiteQuoteAdminRoutes = require("./pods/websiteQuote/admin/serverToAppRoutes");
router.use(`/admin-${process.env.REACT_APP_ADMINCODE}/features/pod/CPOD_WEBSITEQUOTE_ADMIN`, websiteQuoteAdminRoutes);

module.exports = router;
