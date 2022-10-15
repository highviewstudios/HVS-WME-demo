export default function pageNavigation(pageTitle, navigate) {
    if (pageTitle == "/") {
        navigate("/");
    }
    if (pageTitle == "about") {
        navigate("/about");
    }
    if (pageTitle == "contactUs") {
        navigate("/contactUs");
    }
    if (pageTitle == "viewHelp") {
        navigate("/viewHelp");
    }
    if (pageTitle == "webDevelopment") {
        navigate("/webDevelopment");
    }
    if (pageTitle == "appDevelopment") {
        navigate("/appDevelopment");
    }
}
