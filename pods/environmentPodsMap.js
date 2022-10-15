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
            {props.pod == "loginForm" && <HVSAdminLoginControl />}
            {props.pod == "CPOD_PDFLIBRARY_ADMIN" && <PDFLibraryAdmin />}
            {props.pod == "CPOD_PDFLIBRARY_FREND" && <PDFLibraryFrontEnd />}
            {props.pod == "CPOD_WEBSITEQUOTE_ADMIN" && <WebsiteQuoteAdmin />}
            {props.pod == "CPOD_WEBSITEQUOTE_FREND" && <WebsiteQuoteFrontEnd />}
        </div>
    );
}

export default EnvironmentPodsMap;
