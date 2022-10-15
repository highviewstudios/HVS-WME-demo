import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Axios from "axios";

//STYLES
import * as ViewerStyles from "../styles/viewer";

function PDFLibraryViewer() {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    onStart();
  }, []);

  function onStart() {
    Axios.post("/pods/pdfLibraryFE/getFiles")
      .then((res) => {
        const data = res.data;
        if (data.error == "null") {
          setFiles(data.files);
        }
      })
      .catch((err) => console.log(err));
  }

  function handleOnClick(filename) {
    window.open(`./content/PDFLibrary/${filename}`, "_blank");
  }

  return (
    <div>
      <Row>
        <Col md={10} style={ViewerStyles.headings}>
          Name
        </Col>
        <Col style={ViewerStyles.headings}>View</Col>
      </Row>
      {files.map((file, index) => {
        return (
          <Row key={index}>
            <Col md={10} style={ViewerStyles.cell}>
              {file.name}
            </Col>
            <Col style={ViewerStyles.viewCell}>
              <Button
                style={ViewerStyles.viewBtn}
                variant="link"
                onClick={handleOnClick.bind(this, file.filename)}
              >
                View
              </Button>
            </Col>
          </Row>
        );
      })}
    </div>
  );
}

export default PDFLibraryViewer;
