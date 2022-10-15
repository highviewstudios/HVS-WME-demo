import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

//STYLES
import * as navBarStyles from "./styles/navBar";

//NAV METHODS
import pageNavigation from "./navBarClickMethods";

function MobileNavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [servicesSubMenuOpen, setServicesSubMenuOpen] = useState(false);

    const GS_generalSettings = useSelector((state) => state.GS_generalSettings);

    const navigate = useNavigate();

    function toggleMainMenu() {
        setMenuOpen(!menuOpen);
    }

    function toggleServicesMenu() {
        setServicesSubMenuOpen(!servicesSubMenuOpen);
    }

    function pageLinkClick(pageTitle) {
        setMenuOpen(false);
        pageNavigation(pageTitle, navigate);
    }

    return (
        <div>
            <Row>
                <Col style={navBarStyles.navTitle} onClick={pageLinkClick.bind(this, "/")}>
                    High-View Studios
                </Col>
            </Row>
            <Row>
                <Col className="customCSS-nav-link" onClick={toggleMainMenu}>
                    Main Menu
                </Col>
            </Row>
            {menuOpen ? (
                <div>
                    <Row>
                        <Col className="customCSS-nav-link" onClick={pageLinkClick.bind(this, "/")}>
                            Home
                        </Col>
                    </Row>
                    <Row>
                        <Col className="customCSS-nav-link" onClick={pageLinkClick.bind(this, "about")}>
                            About
                        </Col>
                    </Row>
                    <Row>
                        <Col className="customCSS-nav-link" onClick={toggleServicesMenu}>
                            Services
                        </Col>
                    </Row>
                    {servicesSubMenuOpen ? (
                        <div>
                            <Row>
                                <Col className="customCSS-sub-nav-link" onClick={pageLinkClick.bind(this, "webDevelopment")}>
                                    Web Development
                                </Col>
                            </Row>
                            <Row>
                                <Col className="customCSS-sub-nav-link">App Development</Col>
                            </Row>
                            <Row>
                                <Col className="customCSS-sub-nav-link">3D Printing</Col>
                            </Row>
                        </div>
                    ) : null}
                    <Row>
                        <Col className="customCSS-nav-link" onClick={pageLinkClick.bind(this, "viewHelp")}>
                            ViewHelp
                        </Col>
                    </Row>
                    {GS_generalSettings.mainContactPageVisible && (
                        <Col className="customCSS-nav-link" onClick={pageLinkClick.bind(this, "contactUs")}>
                            Contact Us
                        </Col>
                    )}
                </div>
            ) : null}
        </div>
    );
}

export default MobileNavBar;
