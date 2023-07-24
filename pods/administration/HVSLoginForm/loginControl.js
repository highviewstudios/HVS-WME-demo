import React, { useState, useEffect } from "react";
import { Image, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import CenterContainer from "../../special/wholeSite/centerContainer"; //CROSS-OVER POD LINK
//ACTIONS
import * as UserActions from "../../../../store/actions/user";

//STYLES
import * as LoginControlStyles from "./styles/loginControl";

//Image
import logo from "../../../../administration/pods/security/images/logo.png";

const { REACT_APP_KEY } = process.env;

function LoginControl() {
    const [showLogin, setShowLogin] = useState(false);
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);

    useEffect(() => {
        onOpen();
        // eslint-disable-next-line
    }, []);

    function onOpen() {
        if (user.auth) {
            if (user.type !== "registered") {
                setShowLogin(true);
            } else {
                setShowLogin(false);
            }
        } else {
            setShowLogin(true);
        }
    }

    function handleImgOnClick() {
        const username = document.getElementById("username").value;

        const data = { username: username };
        Axios.post("/pods/HVSLogin/accesspass", data)
            .then((res) => {
                const data = res.data;
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleKeyPress(event) {
        if (event.key === "Enter") {
            handleSubmitClick();
        }
    }

    function handleGoToHome() {
        navigate("/");
    }

    function handleLogOut() {
        Axios.post("/userLogin/logout")
            .then((res) => {
                const data = res.data;
                if (data.message === "User logged out") {
                    dispatch(UserActions.UpdateAuth(false));
                    dispatch(UserActions.UpdateID(""));
                    dispatch(UserActions.UpdateName(""));
                    dispatch(UserActions.UpdateEmail(""));
                    dispatch(UserActions.UpdateType(""));
                    setShowLogin(true);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleSubmitClick() {
        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const data = { email: email, password: password };
        Axios.post("/userLogin/auth/local/admin", data)
            .then((res) => {
                const data = res.data;
                // console.log(data);
                if (data.message === "Logged in successful") {
                    dispatch(UserActions.UpdateAuth(true));
                    dispatch(UserActions.UpdateID(data.user.id));
                    dispatch(UserActions.UpdateName(data.user.name));
                    dispatch(UserActions.UpdateEmail(data.user.email));
                    dispatch(UserActions.UpdateType(data.user.type));
                    dispatch(UserActions.UpdateNew(data.user.new == "true"));
                    dispatch(UserActions.UpdateRequestedPassword(data.user.requestedPassword == "true"));
                    setMessage("");

                    if (data.user.new === "true") {
                        navigate(`/admin-${data.adminCode}/security/newPassword`);
                    } else if (data.user.requestedPassword === "true") {
                        navigate(`/admin-${data.adminCode}/security/changePassword`);
                    } else {
                        navigate(`/admin-${data.adminCode}/overview`);
                    }
                } else {
                    setMessage(data.info);
                    if (data.info === "Access denied") {
                        document.getElementById("username").value = "";
                        document.getElementById("password").value = "";
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div>
            <Image style={LoginControlStyles.imgLogo} src={logo} onClick={handleImgOnClick} />
            <CenterContainer style={LoginControlStyles.innerContainer}>
                <h2>High-View Studios</h2>
                <h3>Administration</h3>
                {showLogin ? (
                    <div>
                        <Form.Control type="text" placeholder="Username" id="username" /> <br />
                        <Form.Control type="password" placeholder="Password" id="password" onKeyPress={handleKeyPress} />
                        <p>{message}</p>
                        <Button variant="warning" style={LoginControlStyles.loginBtns} onClick={handleSubmitClick}>
                            Login
                        </Button>
                        <Button variant="warning" style={LoginControlStyles.loginBtns} onClick={handleGoToHome}>
                            Go to Home
                        </Button>
                    </div>
                ) : (
                    <div>
                        <p>Your access to the administration has been denied. Please log out or go back to the home screen.</p>
                        <Button variant="warning" style={LoginControlStyles.loginBtns} onClick={handleLogOut}>
                            Log Out
                        </Button>
                        <Button variant="warning" style={LoginControlStyles.loginBtns} onClick={handleGoToHome}>
                            Go to Home
                        </Button>
                    </div>
                )}
            </CenterContainer>
        </div>
    );
}

export default LoginControl;
