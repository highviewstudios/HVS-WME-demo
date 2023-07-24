const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello Pod Router");
});

//TO KEEP IN
const userRouter = require("../pages/API/userRouter");
router.use("/userRouter", userRouter);

//ADMIN FEATURES
const HVSLogin = require("../pods/administration/HVSLoginForm/API/login");
router.use("/HVSLogin", HVSLogin);

//FEATURES
const pdfLibraryAdmin = require("../pods/pdfLibrary/admin/API/pdfLibrary");
router.use("/pdfLibrary", pdfLibraryAdmin);

const pdfLibraryFrontEnd = require("../pods/pdfLibrary/frontEnd/API/viewer");
router.use("/pdfLibraryFE", pdfLibraryFrontEnd);

const websiteQuoteAdminItems = require("../pods/websiteQuote/admin/API/items");
router.use("/websiteQuote/items", websiteQuoteAdminItems);

const websiteQuoteAdmin = require("../pods/websiteQuote/admin/API/controller");
router.use("/websiteQuote/controller", websiteQuoteAdmin);

const websiteQuoteSystemFrontEnd = require("../pods/websiteQuote/frontEnd/API/quoteSystem");
router.use("/websiteQuote/quoteSystem", websiteQuoteSystemFrontEnd);

module.exports = router;
