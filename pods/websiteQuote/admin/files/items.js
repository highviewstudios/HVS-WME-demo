import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Axios from "axios";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";

//ACTIONS
import * as GS_navSettingsActions from "../../../../../store/actions/globalSettings/GS_navSettings";

//STYLES
import * as ItemsStyles from "../styles/items";
import * as UploadStyles from "../../../../../administration/pods/media/styles/upload"; //CROSS-OVER POD (from pod ref. A5)

function EditItems() {
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState(0);
    const [items, setItems] = useState([]);
    const [values, setValues] = useState({
        item0: "",
        item1: ""
    });
    const [quantities, setQuantites] = useState({
        item0: "",
        item1: ""
    });
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
        dispatch(GS_navSettingsActions.UpdateTitle("Website Quote - Edit Items"));
        dispatch(GS_navSettingsActions.UpdateSelected("Features"));
        dispatch(GS_navSettingsActions.UpdateSubSelected("Website Quote"));
        onLoad();
    }, []);

    function onLoad() {
        Axios.post("/pods/websiteQuote/items/getCategories")
            .then((res) => {
                const data = res.data;
                setCategories(data.categories);
                getCategoryItems(data.categories[0]);
            })
            .catch((err) => console.log(err));
    }

    function handleCategoryClick(cardIndex, name) {
        setSelected(cardIndex);

        getCategoryItems(name);
    }

    function getCategoryItems(category) {
        const data = { category: category };
        setItems([]);
        Axios.post("/pods/websiteQuote/items/getCategoryItems", data)
            .then((res) => {
                const data = res.data;
                console.log(data);
                data.items.map((item, index) => {
                    setItems((prevState) => {
                        return [
                            ...prevState,
                            {
                                id: index,
                                serverUuid: item.uuid,
                                name: item.item,
                                dataType: item.dataType
                            }
                        ];
                    });

                    setQuantites((prevState) => {
                        return { ...prevState, [`item${index}`]: item.quantity };
                    });

                    if (item.dataType == "price") {
                        setValues((prevState) => {
                            return { ...prevState, [`item${index}`]: item.unitPrice.toString() };
                        });
                    }

                    if (item.dataType == "data") {
                        setValues((prevState) => {
                            return { ...prevState, [`item${index}`]: item.data.toString() };
                        });
                    }
                });
            })
            .catch((err) => console.log(err));
    }

    function handleOnChangePrice(event) {
        const { name, value } = event.target;
        setValues((prevState) => {
            return { ...prevState, [name]: value };
        });
    }

    function handleOnChangeQuanity(event) {
        const { name, value } = event.target;
        setQuantites((prevState) => {
            return { ...prevState, [name]: value };
        });
    }

    function handleSaveClick() {
        const data = {
            category: categories[selected],
            items: items,
            values: values,
            quantities: quantities
        };
        Axios.post("/pods/websiteQuote/items/updateData", data)
            .then((res) => {
                const data = res.data;
                if (data.error == "null") {
                    setItems([]);
                    console.log(data);
                    data.items.map((item, index) => {
                        setItems((prevState) => {
                            return [
                                ...prevState,
                                {
                                    id: index,
                                    serverUuid: item.uuid,
                                    name: item.item,
                                    dataType: item.dataType
                                }
                            ];
                        });

                        setQuantites((prevState) => {
                            return { ...prevState, [`item${index}`]: item.quantity };
                        });

                        if (item.dataType == "price") {
                            setValues((prevState) => {
                                return { ...prevState, [`item${index}`]: item.unitPrice.toString() };
                            });
                        }

                        if (item.dataType == "data") {
                            setValues((prevState) => {
                                return { ...prevState, [`item${index}`]: item.data.toString() };
                            });
                        }

                        setModal({
                            header: "Items",
                            error: false,
                            message: data.message,
                            open: true
                        });
                    });
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <div style={ItemsStyles.body}>
            <Row>
                <Col>
                    <h2 style={ItemsStyles.categoryHeading}>Categories</h2>
                </Col>
                <Col>
                    <h2 style={ItemsStyles.categoryHeading}>Items</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    {categories.map((item, index) => {
                        return (
                            <div key={index}>
                                <Card
                                    style={selected == index ? ItemsStyles.cardStyleSelected : ItemsStyles.cardStyle}
                                    onClick={handleCategoryClick.bind(this, index, item)}
                                >
                                    <Card.Body>{item}</Card.Body>
                                </Card>
                                <br />
                            </div>
                        );
                    })}
                </Col>
                <Col>
                    {items.map((item, index) => {
                        return (
                            <div key={index}>
                                <Card style={ItemsStyles.cardStyle}>
                                    <Card.Body>
                                        <div>
                                            {item.name}
                                            <br /> <br />
                                            <Row>
                                                <Col>
                                                    Unit Price / Data:
                                                    <Form.Control
                                                        type="text"
                                                        name={`item${index}`}
                                                        value={values[`item${index}`]}
                                                        onChange={handleOnChangePrice}
                                                    />
                                                </Col>
                                                <Col>
                                                    Quanitiy
                                                    <Form.Control
                                                        type="text"
                                                        name={`item${index}`}
                                                        value={quantities[`item${index}`]}
                                                        onChange={handleOnChangeQuanity}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                    </Card.Body>
                                </Card>
                                <br />
                            </div>
                        );
                    })}
                </Col>
            </Row>
            <Row>
                <Col style={ItemsStyles.saveBtn}>
                    <Button onClick={handleSaveClick}>Save</Button>
                </Col>
            </Row>
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

export default EditItems;
