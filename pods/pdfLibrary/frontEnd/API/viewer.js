const express = require("express");
const mySQLConnection = require("../../../../../../API/connection");

const router = express.Router();

router.post("/getFiles", async (req, res) => {
  const files = await GetFiles();

  const json = {
    error: "null",
    files: files,
  };

  res.send(json);
});

//FUNCTIONS
function GetFiles() {
  return new Promise((resolve, reject) => {
    const FIND_QUERY = "SELECT * FROM pod_pdflibrary WHERE ?";
    const data = { visible: "true" };

    mySQLConnection.query(FIND_QUERY, data, (err, result) => {
      if (err) {
        console.log(err);
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
module.exports = router;
