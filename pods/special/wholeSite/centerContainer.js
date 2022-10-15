import React from "react";
import { Row, Col } from "react-bootstrap";

import * as containerStyles from "./styles/container";

function CenterContainer(props) {
    return (
        <div>
            <Row>
                <Col sm={props.ends == null ? 2 : props.ends}></Col>
                <Col md={props.middle == null ? 8 : props.middle} style={{ ...containerStyles.centerContainer, ...props.style }}>
                    {props.children}
                </Col>
                <Col sm={props.ends == null ? 2 : props.ends}></Col>
            </Row>
        </div>
    );
}

export default CenterContainer;
