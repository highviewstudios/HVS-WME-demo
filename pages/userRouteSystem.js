import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { isBrowser } from "react-device-detect";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";

//STYLES
import * as UserRouteSystemStyles from "./styles/userRouteSystem";

//ACTIONS
import * as UserActions from "../../store/actions/user";
import * as GS_generalSettings from "../../store/actions/globalSettings/GS_generalSettings";

import EnvironmentPodsMap from "../pods/environmentPodsMap";

//USER SIDE
import BrowserNavBar from "../pods/special/navBar/browserNavBar";
import MobileNavBar from "../pods/special/navBar/mobileNavBar";

//FROM ADMIN CORE SIDE
import AdminBanner from "../../administration/pods/adminBanner/adminBanner";
import PageViewer from "../../administration/pods/pageViewer/pageViewer";
import PodViewer from "../../administration/pods/wholeSite/podViewer";
import FrontEndMainContact from "../../administration/pods/contacts/files/frontEndMainContact";
import SiteOffline from "../../administration/pods/siteOffline/files/siteOffline";

function UserRouteSystem() {
    const user = useSelector((state) => state.user);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isOffline, setIsOffline] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        onOpen();
    }, []);

    function onOpen() {
        Axios.post("/pods/userRouter/getOpeningData")
            .then((res) => {
                const data = res.data;
                console.log(data);
                dispatch(GS_generalSettings.UpdateMainContactPageVisible(data.settings.mainContactPage.value == "true"));
                dispatch(GS_generalSettings.UpdateSiteOffline(data.settings.siteOffline.value == "true"));
                dispatch(GS_generalSettings.UpdateSiteOfflineMessage(data.settings.siteOffline.subValue));
                setIsOffline(data.settings.siteOffline.value == "true");

                if (user.auth && user.type !== "registered") {
                    dispatch(UserActions.UpdateAdminSignedIn(true));
                }

                //MEMBERSHIP EXTRA POD
                if (user.requestedPassword) {
                    navigate("/membership/changePassword");
                }

                setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    }

    function offlineUserCheck(role) {
        if (role == "modifier" || role == "registered" || role == "") {
            return false;
        } else {
            return true;
        }
    }

    return (
        <div>
            {isLoaded && (
                <div>
                    {isOffline && !offlineUserCheck(user.type) ? (
                        <div>
                            <SiteOffline />
                        </div>
                    ) : (
                        <div style={UserRouteSystemStyles.body}>
                            {user.adminSignedIn ? <AdminBanner /> : null}
                            {isBrowser ? <BrowserNavBar /> : <MobileNavBar />}
                            <Routes>
                                <Route path="/" exact element={<PageViewer pageID={0} />} />
                                <Route path="/about" element={<PageViewer pageID={1} />} />
                                <Route path="/viewHelp/*" element={<EnvironmentPodsMap pod="CPOD_VIEWHELP_FREND" />} />
                                <Route path="/contactUs" element={<FrontEndMainContact />} />
                                <Route path="/webDevelopment" element={<EnvironmentPodsMap pod="CPOD_WEBSITEQUOTE_FREND" />} />
                            </Routes>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserRouteSystem;
