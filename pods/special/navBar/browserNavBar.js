import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

//STYLES
import * as navBarStyles from "./styles/navBar";

//NAV METHODS
import pageNavigation from "./navBarClickMethods";

function BrowserNavBar() {
    const [servicesSubMenu, setServicesSubMenu] = useState(false);

    const GS_generalSettings = useSelector((state) => state.GS_generalSettings);

    const navigate = useNavigate();

    const servicesSubMenuItems = [
        { title: "Web Development", method: () => pageNavigation("webDevelopment", navigate) },
        { title: "App Development", method: () => pageNavigation("appDevelopment", navigate) }
        // { title: "3D Printing", method: null }
    ];

    function ServicesSubMenuShow() {
        setServicesSubMenu(true);
    }
    function ServicesSubMenuHidden() {
        setServicesSubMenu(false);
    }

    return (
        <div>
            <div style={navBarStyles.navOverAll}>
                <Row style={navBarStyles.navStyle}>
                    <Col md={4}>
                        <Row>
                            <Col style={navBarStyles.navTitle} onClick={() => pageNavigation("/", navigate)}>
                                High-View Studios
                            </Col>
                        </Row>
                    </Col>
                    <Col m={8}>
                        <Row>
                            <Col className="customCSS-nav-link" onClick={() => pageNavigation("/", navigate)}>
                                Home
                            </Col>
                            <Col className="customCSS-nav-link" onClick={() => pageNavigation("about", navigate)}>
                                About
                            </Col>
                            <Col className="customCSS-nav-link" onMouseEnter={ServicesSubMenuShow} onMouseLeave={ServicesSubMenuHidden}>
                                Services
                            </Col>
                            <Col className="customCSS-nav-link" onClick={() => pageNavigation("viewHelp", navigate)}>
                                ViewHelp
                            </Col>
                            {GS_generalSettings.mainContactPageVisible && (
                                <Col className="customCSS-nav-link" onClick={() => pageNavigation("contactUs", navigate)}>
                                    Contact Us
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
                <div
                    style={
                        servicesSubMenu
                            ? { ...navBarStyles.subNavStyle, ...navBarStyles.subNavShow }
                            : { ...navBarStyles.subNavStyle, ...navBarStyles.subNavHidden }
                    }
                >
                    {servicesSubMenuItems.map((item, index) => {
                        return (
                            <Row key={index}>
                                <Col md={4}></Col>
                                <Col md={8}>
                                    <Row>
                                        <Col></Col>
                                        <Col></Col>
                                        <Col
                                            className={index < servicesSubMenuItems.length - 1 ? "customCSS-sub-nav-link" : "customCSS-sub-nav-link"}
                                            style={
                                                index < servicesSubMenuItems.length - 1
                                                    ? navBarStyles.subNavLRBorders
                                                    : {
                                                          ...navBarStyles.subNavLRBorders,
                                                          ...navBarStyles.subNavBottom
                                                      }
                                            }
                                            onMouseEnter={ServicesSubMenuShow}
                                            onMouseLeave={ServicesSubMenuHidden}
                                            onClick={item.method}
                                        >
                                            {item.title}
                                        </Col>
                                        <Col></Col>
                                        {GS_generalSettings.mainContactPageVisible && <Col></Col>}
                                    </Row>
                                </Col>
                            </Row>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default BrowserNavBar;
