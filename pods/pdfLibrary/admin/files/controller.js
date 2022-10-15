import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Row, Col, Button, Card, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

//ACTION
import * as GS_navSettingsActions from "../../../../../store/actions/globalSettings/GS_navSettings";

//STYLES
import * as ControllerStyles from "../styles/controller";

function Controller() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [pdfs, setPdfs] = useState([]);
    const [directoryExist, setDirectoryExist] = useState(true);

    useEffect(() => {
        dispatch(GS_navSettingsActions.UpdateTitle("PDF Library"));
        dispatch(GS_navSettingsActions.UpdateSelected("Features"));
        dispatch(GS_navSettingsActions.UpdateSubSelected("PDF Library"));
        fetchPDFs();
    }, []);

    const [modalYN, setModalYN] = useState({
        open: false,
        heading: "",
        message: "",
        acceptFunction: "",
        acceptName: "",
        showAccept: false,
        cancelName: "",
        showCancel: false
    });

    function handleModalYNClose() {
        setModalYN((prevState) => {
            return { ...prevState, open: false };
        });
    }

    function fetchPDFs() {
        Axios.post("/pods/pdfLibrary/getAllPDFs")
            .then((res) => {
                const data = res.data;
                if (data.error == "null") {
                    if (!data.dirExist) {
                        setDirectoryExist(false);
                    } else {
                        setPdfs(data.pdfs);
                    }
                }
            })
            .catch((err) => console.log(err));
    }

    function handleAddPDF() {
        navigate("./upload");
    }

    function handleDeleteButton(id) {
        setModalYN({
            heading: "Delete PDF",
            message: "Are you sure you want to delete this PDF?",
            showAccept: true,
            acceptName: "Yes",
            acceptFunction: acceptDelete.bind(this, id),
            showCancel: true,
            cancelName: "No",
            open: true
        });
    }

    function acceptDelete(id) {
        setModalYN((prevState) => {
            return { ...prevState, open: false };
        });

        const data = { id: id, getPDFs: true };
        Axios.post("/pods/pdfLibrary/deletePDF", data)
            .then((res) => {
                const data = res.data;
                if (data.error == "null") {
                    setPdfs(data.pdfs);
                }
            })
            .catch((err) => console.log(err));
    }

    function handleEditItem(id) {
        navigate(`./modify/${id}`);
    }

    return (
        <div style={ControllerStyles.body}>
            {directoryExist ? (
                <div>
                    <Row>
                        <Col>
                            <Button onClick={handleAddPDF}>Add PDF</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={ControllerStyles.container}>
                            {pdfs.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <Card style={ControllerStyles.cardStyle}>
                                            <Card.Body>
                                                <Row>
                                                    <Col sm={4}>{item.name}</Col>
                                                    <Col sm={4}>{item.filename}</Col>
                                                    <Col sm={2}>
                                                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                                            <Button variant="warning" onClick={handleEditItem.bind(this, item.uuid)}>
                                                                <i className="fa-solid fa-pen-to-square"></i>
                                                            </Button>
                                                        </OverlayTrigger>
                                                    </Col>
                                                    <Col sm={2}>
                                                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                                            <Button variant="danger" onClick={handleDeleteButton.bind(this, item.uuid)}>
                                                                <i className="fa-solid fa-trash-can"></i>
                                                            </Button>
                                                        </OverlayTrigger>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                        <br />
                                    </div>
                                );
                            })}
                        </Col>
                    </Row>
                    <Modal show={modalYN.open} onHide={handleModalYNClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{modalYN.heading}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{modalYN.message}</Modal.Body>
                        <Modal.Footer>
                            {modalYN.showAccept ? (
                                <div>
                                    <Button variant="primary" onClick={modalYN.acceptFunction}>
                                        {modalYN.acceptName}
                                    </Button>
                                </div>
                            ) : null}
                            {modalYN.showCancel ? (
                                <div>
                                    <Button variant="primary" onClick={handleModalYNClose}>
                                        {modalYN.cancelName}
                                    </Button>
                                </div>
                            ) : null}
                        </Modal.Footer>
                    </Modal>
                </div>
            ) : (
                <div style={ControllerStyles.errorMessage}>
                    <br />
                    <p>The Pod&#39;s resource folder and/or the global temp folder does not exist, please contact High-View Studios</p>
                </div>
            )}
        </div>
    );
}

export default Controller;
