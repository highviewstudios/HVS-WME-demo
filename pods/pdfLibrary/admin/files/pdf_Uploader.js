import React, { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Axios from "axios";
import { useDispatch } from "react-redux";
import Switch from "react-switch";
import { useNavigate, useParams } from "react-router-dom";

//ACTIONS
import * as GS_navSettingsActions from "../../../../../store/actions/globalSettings/GS_navSettings";

//STYLES
import * as UploadStyles from "../../../../../administration/pods/media/styles/upload"; //CROSS-OVER POD (from pod ref. A5)
import * as PDF_UploaderStyles from "../styles/pdf_Uploader";

function PDF_Uploader(props) {
  const [file, setFile] = useState(null);
  const [settings, setSettings] = useState({
    name: "",
    visible: true,
    fileName: "",
    fileStatus: "",
  });
  const navigate = useNavigate();
  const params = useParams();

  const dispatch = useDispatch();

  const [modalYN, setModalYN] = useState({
    open: false,
    heading: "",
    message: "",
    acceptFunction: "",
    acceptName: "",
    showAccept: false,
    cancelName: "",
    showCancel: false,
  });

  function handleModalYNClose() {
    setModalYN((prevState) => {
      return { ...prevState, open: false };
    });
  }

  useEffect(() => {
    dispatch(GS_navSettingsActions.UpdateTitle("Upload PDF"));
    dispatch(GS_navSettingsActions.UpdateSelected("Features"));
    dispatch(GS_navSettingsActions.UpdateSubSelected("Download Library"));

    if (props.modify) {
      getPdfSlot();
    }
  }, []);

  const [modal, setModal] = useState({
    header: "",
    open: false,
    message: "",
    error: false,
  });

  function handleCloseModal() {
    setModal((prevState) => {
      return { ...prevState, open: false };
    });
  }

  function onInputChange(e) {
    setFile(e.target.files);
    setSettings((prevState) => {
      return {
        ...prevState,
        fileStatus: "new",
      };
    });
  }

  function getPdfSlot() {
    const data = { id: params.id };
    Axios.post("/pods/pdfLibrary/getPdfSlot", data)
      .then((res) => {
        const data = res.data;
        setSettings((prevState) => {
          return {
            ...prevState,
            name: data.file.name,
            visible: data.file.visible == "true",
            fileName: data.file.filename,
            fileStatus: "current",
          };
        });
      })
      .catch((err) => console.log(err));
  }

  function handleAddFileClick(e) {
    e.preventDefault();

    if (settings.name == "") {
      setModal({
        header: "Add File",
        error: true,
        message: "Please enter a name",
        open: true,
      });
    } else if (file == null) {
      setModal({
        header: "Add File",
        error: true,
        message: "Please add a file",
        open: true,
      });
    } else {
      addFile();
    }
  }

  function addFile() {
    const checkData = {
      fileName: file[0].name,
      fileSize: file[0].size,
      fileType: file[0].type,
      name: settings.name,
      modify: false,
    };

    const uploadFormData = new FormData();
    uploadFormData.append("pdf", file[0]);
    uploadFormData.append("name", settings.name);
    uploadFormData.append("visible", settings.visible.toString());

    const uploadConfig = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    Axios.post("/pods/pdfLibrary/checkFile", checkData)
      .then((res) => {
        const firstData = res.data;
        if (firstData.failed == "Yes") {
          setModal({
            header: "Upload",
            error: true,
            message: firstData.message,
            open: true,
          });
        } else {
          Axios.post(
            "/pods/pdfLibrary/uploadFile",
            uploadFormData,
            uploadConfig
          )
            .then((res) => {
              const secondData = res.data;
              if (secondData.name == "MulterError") {
                setModal({
                  error: true,
                  header: "Upload: Error",
                  message: secondData.message,
                  open: true,
                });
              } else {
                navigate("../");
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }

  function handleVisibleChange(checked) {
    setSettings((prevState) => {
      return { ...prevState, visible: checked };
    });
  }

  function handleNameChange(e) {
    const { value } = e.target;
    setSettings((prevState) => {
      return { ...prevState, name: value };
    });
  }

  function handleRemoveFile() {
    setSettings((prevState) => {
      return { ...prevState, fileName: "", fileStatus: "deleted" };
    });
  }

  function handleUpdateFile() {
    if (settings.fileStatus == "deleted") {
      setModalYN({
        heading: "Update PDF",
        message:
          "You have removed the file on this item, do you want to delete the entire item?",
        showAccept: true,
        acceptName: "Yes",
        acceptFunction: acceptDeleteWholeItem.bind(this, params.id),
        showCancel: true,
        cancelName: "No",
        open: true,
      });
    } else {
      if (settings.fileStatus == "current") {
        const data = {
          id: params.id,
          name: settings.name,
          visible: settings.visible.toString(),
        };
        Axios.post("/pods/pdfLibrary/updatePDFdetailsOnly", data)
          .then((res) => {
            const data = res.data;
            if (data.error == "null") {
              navigate("../");
            }
          })
          .catch((err) => console.log(err));
      } else if (settings.fileStatus == "new") {
        updateFileAndData(params.id);
      }
    }
  }

  function acceptDeleteWholeItem(id) {
    const data = { id: id, getPDFs: false };

    Axios.post("/pods/pdfLibrary/deletePDF", data)
      .then((res) => {
        const data = res.data;
        console.log(data);
        if (data.error == "null") {
          navigate("../");
        }
      })
      .catch((err) => console.log(err));
  }

  function updateFileAndData(uuid) {
    const checkData = {
      fileName: file[0].name,
      fileSize: file[0].size,
      fileType: file[0].type,
      name: settings.name,
      modify: true,
    };

    const uploadFormData = new FormData();
    uploadFormData.append("pdf", file[0]);
    uploadFormData.append("uuid", uuid);
    uploadFormData.append("name", settings.name);
    uploadFormData.append("visible", settings.visible.toString());

    const uploadConfig = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    Axios.post("/pods/pdfLibrary/checkFile", checkData)
      .then((res) => {
        const firstData = res.data;
        if (firstData.failed == "Yes") {
          setModal({
            header: "Upload",
            error: true,
            message: firstData.message,
            open: true,
          });
        } else {
          Axios.post(
            "/pods/pdfLibrary/uploadUpdatedFile",
            uploadFormData,
            uploadConfig
          )
            .then((res) => {
              const secondData = res.data;
              if (secondData.name == "MulterError") {
                setModal({
                  error: true,
                  header: "Upload: Error",
                  message: secondData.message,
                  open: true,
                });
              } else {
                navigate("../");
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div style={PDF_UploaderStyles.body}>
      <Row>
        <Col>
          <Row>
            <Col>
              <Form.Label>Name:</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                value={settings.name}
                onChange={handleNameChange}
              />
              <br />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Visible:</Form.Label>
            </Col>
            <Col>
              <Switch
                className="customCSS-Content-New-Item-Switch"
                onChange={handleVisibleChange}
                checked={settings.visible}
                checkedIcon={false}
                uncheckedIcon={false}
              />
            </Col>
          </Row>
        </Col>
        <Col></Col>
      </Row>
      <br />
      {settings.fileName != "" ? (
        <div>
          <Row>
            <Col>
              <Row>
                <Col>
                  Filename: <br />
                  {settings.fileName}
                </Col>
                <Col>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Remove File</Tooltip>}
                  >
                    <Button variant="danger" onClick={handleRemoveFile}>
                      <i className="fa-solid fa-trash-can"></i>
                    </Button>
                  </OverlayTrigger>
                </Col>
              </Row>
            </Col>
            <Col></Col>
          </Row>
        </div>
      ) : (
        <div>
          <Row>
            <Col>
              <Form.Control type="file" name="pdf" onChange={onInputChange} />
            </Col>
            <Col></Col>
          </Row>
        </div>
      )}
      <Row>
        <Col style={PDF_UploaderStyles.addBtn}>
          <br />
          {props.modify ? (
            <div>
              <Button onClick={handleUpdateFile}>Update File</Button>
            </div>
          ) : (
            <div>
              <Button onClick={handleAddFileClick}>Add File</Button>
            </div>
          )}
        </Col>
        <Col></Col>
      </Row>
      <Modal show={modal.open} onHide={handleCloseModal}>
        <Modal.Header
          closeButton
          style={
            modal.error
              ? UploadStyles.errorModalColor
              : UploadStyles.successModalColor
          }
        >
          <Modal.Title>{modal.header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modal.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
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
  );
}

export default PDF_Uploader;
