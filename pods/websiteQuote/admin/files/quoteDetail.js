import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Row, Col, Table, Button, Modal, Form } from "react-bootstrap";

//ACTIONS
import * as GS_navSettingsActions from "../../../../../store/actions/globalSettings/GS_navSettings";

//STYLES
import * as ControllerStyles from "../styles/controller";
import * as UploadStyles from "../../../../../administration/pods/media/styles/upload"; //CROSS-OVER POD (from pod ref. A5)

function QuoteDetail() {
    const params = useParams();
    const dispatch = useDispatch();
    const [details, setDetails] = useState([]);
    const [usersDetails, setUsersDetails] = useState({
        name: "",
        email: ""
    });
    const [declineModal, setDecineModal] = useState({
        open: false,
        reason: "",
        maxLength: 50,
        currentLeft: 50
    });

    function handleDeclineModalClose() {
        setDecineModal((prevState) => {
            return { ...prevState, open: false };
        });
    }

    const [modal, setModal] = useState({
        header: "",
        open: false,
        message: "",
        error: false
    });

    function handleCloseModal() {
        setModal((prevState) => {
            return { ...prevState, open: false };
        });
    }

    useEffect(() => {
        dispatch(GS_navSettingsActions.UpdateTitle("Website Quote - Details"));
        dispatch(GS_navSettingsActions.UpdateSelected("Features"));
        dispatch(GS_navSettingsActions.UpdateSubSelected("Website Quote"));

        const data = { uuid: params.uuid };
        Axios.post("/pods/websiteQuote/controller/getQuoteData", data)
            .then((res) => {
                const data = res.data;
                if (data.error == "null") {
                    setDetails(data.quote);

                    setUsersDetails({ name: data.quote.user.fullName, email: data.quote.user.email });
                }
            })
            .catch((err) => console.log(err));
    }, []);

    function handleDeclineModalChangeTextArea(e) {
        const { name, value } = e.target;

        const newLength = declineModal.maxLength - value.length;

        setDecineModal((prevState) => {
            return { ...prevState, reason: value, currentLeft: newLength };
        });
    }

    function handleDeclineButtonClick() {
        setDecineModal((prevState) => {
            return { ...prevState, reason: "", currentLeft: 50, open: true };
        });
    }

    function handleAcceptClick() {
        const data = { uuid: params.uuid, name: usersDetails.name, email: usersDetails.email, setupPrice: `£${details.total_setup}` };
        Axios.post("/pods/websiteQuote/controller/acceptQuote", data)
            .then((res) => {
                const data = res.data;

                setDetails(data.quoteData);
                setUsersDetails({ name: data.quoteData.user.fullName, email: data.quoteData.user.email });

                setModal({ header: "Website Quote: Accepted", error: false, message: data.userMessage, open: true });
            })
            .catch((err) => console.log(err));
    }

    function handleDeclineClick() {
        if (declineModal.reason == "") {
            setModal({ header: "Website Quote", error: true, message: "Please put a reason", open: true });
        } else {
            setDecineModal((prevState) => {
                return { ...prevState, open: false };
            });
            const data = {
                uuid: params.uuid,
                name: usersDetails.name,
                email: usersDetails.email,
                setupPrice: `£${details.total_setup}`,
                reason: declineModal.reason
            };
            Axios.post("/pods/websiteQuote/controller/declineQuote", data)
                .then((res) => {
                    const data = res.data;

                    setDetails(data.quoteData);
                    setUsersDetails({ name: data.quoteData.user.fullName, email: data.quoteData.user.email });

                    setModal({ header: "Website Quote: Decline", error: false, message: data.userMessage, open: true });
                })
                .catch((err) => console.log(err));
        }
    }

    return (
        <div style={ControllerStyles.body}>
            <Row>
                <Col md={8}>
                    <div>
                        <Table style={ControllerStyles.itemsTable}>
                            <thead>
                                <tr>
                                    <th style={ControllerStyles.tableHeadings}>Category</th>
                                    <th style={ControllerStyles.tableHeadings}>Item</th>
                                    <th style={ControllerStyles.tableHeadings}>Unit Price</th>
                                    <th style={ControllerStyles.tableHeadings}>Quantity</th>
                                    <th style={ControllerStyles.tableHeadings}>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={ControllerStyles.tableCells}>Hosting Type</td>
                                    <td style={ControllerStyles.tableCells}>{details.value_webType}</td>
                                    <td style={ControllerStyles.tableCells}>£{details.uPrice_webType}</td>
                                    <td style={ControllerStyles.tableCells}>{details.q_webType}</td>
                                    <td style={ControllerStyles.tableCells}>£{details.price_webType}</td>
                                </tr>
                                <tr>
                                    <td style={ControllerStyles.tableCells}>Setup Fee</td>
                                    <td style={ControllerStyles.tableCells}>{details.value_webType} Setup</td>
                                    <td style={ControllerStyles.tableCells}>£{details.uPrice_setup}</td>
                                    <td style={ControllerStyles.tableCells}>{details.q_setup}</td>
                                    <td style={ControllerStyles.tableCells}>£{details.price_setup}</td>
                                </tr>
                                <tr>
                                    <td style={ControllerStyles.tableCells}>Domain Name</td>
                                    <td style={ControllerStyles.tableCells}>{details.value_domainName}</td>
                                    <td style={ControllerStyles.tableCells}>£{details.uPrice_domainName}</td>
                                    <td style={ControllerStyles.tableCells}>{details.q_domainName}</td>
                                    <td style={ControllerStyles.tableCells}>£{details.price_domainName}</td>
                                </tr>
                                <tr>
                                    <td style={ControllerStyles.tableCells}>SSL Certificate</td>
                                    <td style={ControllerStyles.tableCells}>{details.value_sslCert}</td>
                                    <td style={ControllerStyles.tableCells}>£{details.uPrice_sslCert}</td>
                                    <td style={ControllerStyles.tableCells}>{details.q_sslCert}</td>
                                    <td style={ControllerStyles.tableCells}>£{details.price_sslCert}</td>
                                </tr>
                                <tr>
                                    <td style={ControllerStyles.tableCells}>Location</td>
                                    <td style={ControllerStyles.tableCells}>{details.value_location}</td>
                                    <td style={ControllerStyles.tableCells}>£{details.uPrice_location}</td>
                                    <td style={ControllerStyles.tableCells}>{details.q_location}</td>
                                    <td style={ControllerStyles.tableCells}>£{details.price_location}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <br />
                        <Row>
                            <Col>
                                <Table style={ControllerStyles.itemsTable}>
                                    <tbody>
                                        <tr>
                                            <td style={ControllerStyles.tableCells}>Setup Total</td>
                                            <td style={ControllerStyles.tableCells}>£{details.total_setup}</td>
                                        </tr>
                                        <tr>
                                            <td style={ControllerStyles.tableCells}>Yearly Total</td>
                                            <td style={ControllerStyles.tableCells}>£{details.total_yearly}</td>
                                        </tr>
                                        <tr>
                                            <td style={ControllerStyles.tableCells}>Status</td>
                                            <td style={ControllerStyles.tableCells}>{details.status}</td>
                                        </tr>
                                        {details.status == "Declined" && (
                                            <tr>
                                                <td style={ControllerStyles.tableCells}>Reason</td>
                                                <td style={ControllerStyles.tableCells}>{details.declineReason}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <br />
                                <Table style={ControllerStyles.itemsTable}>
                                    <tbody>
                                        <tr>
                                            <td style={ControllerStyles.tableCells}>Name</td>
                                            <td style={ControllerStyles.tableCells}>{usersDetails.name}</td>
                                        </tr>
                                        <tr>
                                            <td style={ControllerStyles.tableCells}>Email</td>
                                            <td style={ControllerStyles.tableCells}>{usersDetails.email}</td>
                                        </tr>
                                        <tr>
                                            <td style={ControllerStyles.tableCells}>Additional Information</td>
                                            <td style={ControllerStyles.tableCells}>{details.additionalInfo}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col style={ControllerStyles.acceptDeclineBtns}>
                                <Button onClick={handleAcceptClick}>Accept</Button> <br />
                                <Button onClick={handleDeclineButtonClick}>Decline</Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col md={4}></Col>
            </Row>

            <Modal show={declineModal.open} onHide={handleDeclineModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Decline Quote</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Reason:
                    <Form.Control
                        as="textarea"
                        rows={2}
                        onChange={handleDeclineModalChangeTextArea}
                        value={declineModal.reason}
                        maxLength={declineModal.maxLength}
                    />
                    <Row>
                        <Col style={ControllerStyles.lengthCounter}>{declineModal.currentLeft}</Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleDeclineModalClose}>Close</Button>
                    <Button onClick={handleDeclineClick}>Submit</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={modal.open} onHide={handleCloseModal}>
                <Modal.Header closeButton style={modal.error ? UploadStyles.errorModalColor : UploadStyles.successModalColor}>
                    <Modal.Title>{modal.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modal.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default QuoteDetail;
