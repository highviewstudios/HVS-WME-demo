const express = require("express");
const path = require("path");
const router = express.Router();

//PODS
const pdfLibraryAdminRoutes = require("./pods/pdfLibrary/admin/serverToAppRoutes");
router.use(`/features/pod/CPOD_PDFLIBRARY_ADMIN`, pdfLibraryAdminRoutes);

const websiteQuoteAdminRoutes = require("./pods/websiteQuote/admin/serverToAppRoutes");
router.use(`/features/pod/CPOD_WEBSITEQUOTE_ADMIN`, websiteQuoteAdminRoutes);

module.exports = router;
