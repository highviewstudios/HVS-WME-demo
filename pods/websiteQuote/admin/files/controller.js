import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

//ACTIONS
import * as GS_navSettingsActions from "../../../../../store/actions/globalSettings/GS_navSettings";

//STYLES
import * as ControllerStyles from "../styles/controller";

function Controller() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        dispatch(GS_navSettingsActions.UpdateTitle("Website Quote"));
        dispatch(GS_navSettingsActions.UpdateSelected("Features"));
        dispatch(GS_navSettingsActions.UpdateSubSelected("Website Quote"));

        Axios.post("/pods/websiteQuote/controller/getQuotes")
            .then((res) => {
                const data = res.data;
                console.log(data);
                if (data.error == "null") {
                    setQuotes(data.quotes);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    function handleEditItemsClick() {
        navigate("./editItems");
    }

    function handleQuoteDoubleClick(uuid) {
        console.log(uuid);
        navigate(`./quote/${uuid}`);
    }

    return (
        <div style={ControllerStyles.body}>
            <Row>
                <Col style={ControllerStyles.doubleClickMessage}>Double click on quote to view full details</Col>
                <Col style={ControllerStyles.editItemsBtn}>
                    <Button onClick={handleEditItemsClick}>Edit Items</Button>
                </Col>
            </Row>
            <Card style={ControllerStyles.cardStyleHeadings}>
                <Card.Body>
                    <Row>
                        <Col>Name</Col>
                        <Col>Email</Col>
                        <Col>Setup Price</Col>
                        <Col>Yearly Price</Col>
                    </Row>
                </Card.Body>
            </Card>
            <br />
            <div style={ControllerStyles.scrollableBox}>
                {quotes.map((quote, index) => {
                    return (
                        <div key={index}>
                            <Card style={ControllerStyles.cardStyle} onDoubleClick={handleQuoteDoubleClick.bind(this, quote.uuid)}>
                                <Card.Body>
                                    <Row>
                                        <Col>{quote.user.fullName}</Col>
                                        <Col>{quote.user.email}</Col>
                                        <Col>£{quote.total_setup}</Col>
                                        <Col>£{quote.total_yearly}</Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <br />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Controller;
