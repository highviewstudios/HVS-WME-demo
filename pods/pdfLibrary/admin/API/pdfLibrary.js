const express = require("express");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const mySQLConnection = require("../../../../../../API/connection");

const router = express.Router();

const multerConfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, process.env.TEMP_DIRECTORY);
    },
    filename: (req, file, callback) => {
        const ext = file.mimetype.split("/")[1];
        callback(null, `pdf-${Date.now()}.${ext}`);
    }
});

const isPdf = (req, file, callback) => {
    if (file.mimetype == "application/pdf") {
        callback(null, true);
    } else {
        console.log(file);
        const json = {
            name: "MulterError",
            message: "Only PDFs are allowed..."
        };
        callback(json);
    }
};

const maxSize = 4 * 1024 * 1024;
const uploadPDF = multer({
    storage: multerConfig,
    fileFilter: isPdf,
    limits: { fileSize: maxSize }
});

router.get("/ping", (req, res) => {
    res.send("pinging downloadLibrary Server!");
});

router.post("/uploadFile", uploadSingleFile, async (req, res) => {
    const originalname = req.file.originalname.replace(/ /g, "_");
    const originalPath = req.file.path;

    const name = req.body.name;
    const visible = req.body.visible;

    console.log(name);
    console.log(visible);

    await fs.move(originalPath, path.join(process.env.CONTENT_FOLDER, "PDFLibrary", originalname));

    await InsertNewFile(name, visible, originalname);

    const json = {
        error: "null",
        message: "File Uploaded Successfully"
    };

    res.send(json);
});

router.post("/checkFile", async (req, res) => {
    const fileName = req.body.fileName;
    const fileSize = req.body.fileSize;
    const fileType = req.body.fileType;
    const name = req.body.name;
    const modify = req.body.modify;

    let failed = false;
    let message = "";

    const exists = await fs.pathExists(path.join(process.env.CONTENT_FOLDER, "PDFLibrary", fileName.replace(/ /g, "_")));
    const size = fileSize < maxSize;
    const type = fileType == "application/pdf";
    const fileSlot = await GetFile(name);

    if (exists) {
        failed = true;
        message = "The file selected has already been uploaded";
    } else if (!size) {
        failed = true;
        message = "The file is too large";
    } else if (!type) {
        failed = true;
        message = "The file is not a pdf";
    } else if (!modify && fileSlot != null) {
        failed = true;
        message = "The name has already been used for another file";
    }

    if (failed) {
        const json = {
            failed: "Yes",
            message: message
        };
        res.send(json);
    } else {
        const json = {
            failed: "No",
            message: "File ok to be uploaded!"
        };
        res.send(json);
    }
});

router.post("/getAllPDFs", async (req, res) => {
    const temp = await fs.pathExists(process.env.TEMP_DIRECTORY);
    const pdfLibraryFolder = await fs.pathExists(process.env.CONTENT_FOLDER, "PDFLibrary");

    if (pdfLibraryFolder && temp) {
        const pdfs = await GetAllPDFs();

        const json = {
            error: "null",
            dirExist: true,
            pdfs: pdfs
        };

        res.send(json);
    } else {
        const json = {
            error: "null",
            dirExist: false
        };
        res.send(json);
    }
});

router.post("/deletePDF", async (req, res) => {
    const id = req.body.id;
    const getPDFs = req.body.getPDFs;

    const file = await GetFileFromID(id);

    await fs.remove(path.join(process.env.CONTENT_FOLDER, "PDFLibrary", file.filename));
    await DeletePDF(id);

    if (getPDFs) {
        const json = {
            error: "null",
            message: "PDF Deleted",
            pdfs: await GetAllPDFs()
        };
        res.send(json);
    } else {
        const json = {
            error: "null",
            message: "PDF Deleted"
        };
        res.send(json);
    }
});

router.post("/getPdfSlot", async (req, res) => {
    const id = req.body.id;

    const file = await GetFileFromID(id);

    const json = {
        error: "null",
        file: file
    };

    res.send(json);
});

router.post("/updatePDFdetailsOnly", async (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const visible = req.body.visible;

    const result = await UpdatePDF_NameAndVisible(id, name, visible);
    if (result == "Success") {
        const json = {
            error: "null",
            message: "PDF Item updated"
        };
        res.send(json);
    }
});

router.post("/uploadUpdatedFile", uploadSingleFile, async (req, res) => {
    const originalname = req.file.originalname.replace(/ /g, "_");
    const originalPath = req.file.path;

    const uuid = req.body.uuid;
    const name = req.body.name;
    const visible = req.body.visible;

    const file = await GetFileFromID(uuid);

    await fs.remove(path.join(process.env.CONTENT_FOLDER, "PDFLibrary", file.filename));

    await fs.move(originalPath, path.join(process.env.CONTENT_FOLDER, "PDFLibrary", originalname));

    const result = await UpdatePDF_NameVisibleAndFilename(uuid, name, visible, originalname);

    if (result == "Success") {
        const json = {
            error: "null",
            message: "File Updated Successfully"
        };
        res.send(json);
    }
});

//FUNCTIONS
function uploadSingleFile(req, res, next) {
    const upload = uploadPDF.single("pdf");

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.send(err);
        } else if (err) {
            res.send(err);
        } else {
            next();
        }
    });
}

function GetFile(name) {
    return new Promise((resolve, reject) => {
        const FIND_QUERY = "SELECT * FROM pod_pdflibrary WHERE ?";
        const data = { name: name };

        mySQLConnection.query(FIND_QUERY, data, (err, result) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                resolve(result[0]);
            }
        });
    });
}

function GetFileFromID(id) {
    return new Promise((resolve, reject) => {
        const FIND_QUERY = "SELECT * FROM pod_pdflibrary WHERE ?";
        const data = { uuid: id };

        mySQLConnection.query(FIND_QUERY, data, (err, result) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                resolve(result[0]);
            }
        });
    });
}

function InsertNewFile(name, visible, filename) {
    return new Promise(async (resolve, reject) => {
        const data = { name: name, visible: visible, filename: filename };
        const query = "INSERT pod_pdflibrary SET ?";
        mySQLConnection.query(query, data, (err, result) => {
            if (err) {
                console.log(err);
                const json = {
                    message: "Error",
                    result: err
                };
                reject(json);
            } else {
                const json = {
                    message: "Success",
                    result: result.insertId
                };
                resolve(json);
            }
        });
    });
}

function GetAllPDFs() {
    return new Promise((resolve, reject) => {
        const FIND_QUERY = "SELECT * FROM pod_pdflibrary";

        mySQLConnection.query(FIND_QUERY, (err, result) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                resolve(result);
            }
        });
    });
}

function DeletePDF(uuid) {
    return new Promise(async (resolve, reject) => {
        const data = { uuid: uuid };
        const query = "DELETE FROM pod_pdflibrary WHERE ?";
        mySQLConnection.query(query, data, (err, result) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                resolve("Success");
            }
        });
    });
}

function UpdatePDF_NameAndVisible(uuid, name, visible) {
    return new Promise((resolve, reject) => {
        const data = [{ name: name, visible: visible }, uuid];
        const UPDATE_QUERY = "UPDATE pod_pdflibrary SET ? WHERE uuid=?";

        mySQLConnection.query(UPDATE_QUERY, data, (err, results) => {
            if (err) {
                reject();
            } else {
                resolve("Success");
            }
        });
    });
}

function UpdatePDF_NameVisibleAndFilename(uuid, name, visible, filename) {
    return new Promise((resolve, reject) => {
        const data = [{ name: name, visible: visible, filename: filename }, uuid];
        const UPDATE_QUERY = "UPDATE pod_pdflibrary SET ? WHERE uuid=?";

        mySQLConnection.query(UPDATE_QUERY, data, (err, results) => {
            if (err) {
                reject();
            } else {
                resolve("Success");
            }
        });
    });
}

module.exports = router;
