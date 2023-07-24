import React from "react";

//PODS
//--ADMIN
import HVSAdminLoginControl from "./administration/HVSLoginForm/loginControl";
import PDFLibraryAdmin from "./pdfLibrary/admin/podRouter";
import WebsiteQuoteAdmin from "./websiteQuote/admin/podRouter";

//--FRONTEND
import PDFLibraryFrontEnd from "./pdfLibrary/frontEnd/files/viewer";
import WebsiteQuoteFrontEnd from "./websiteQuote/frontEnd/files/quoteSystem";

function EnvironmentPodsMap(props) {
    return (
        <div>
            {props.podCode == "loginForm" && <HVSAdminLoginControl />}
            {props.podCode == "CPOD_PDFLIBRARY_ADMIN" && <PDFLibraryAdmin />}
            {props.podCode == "CPOD_PDFLIBRARY_FREND" && <PDFLibraryFrontEnd />}
            {props.podCode == "CPOD_WEBSITEQUOTE_ADMIN" && <WebsiteQuoteAdmin />}
            {props.podCode == "CPOD_WEBSITEQUOTE_FREND" && <WebsiteQuoteFrontEnd />}
        </div>
    );
}

export default EnvironmentPodsMap;
