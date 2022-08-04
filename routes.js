// const pConnection = require("./mySQL/connection.js");
const express = require("express");
const router = express.Router();
module.exports = router;

router.post("/calculate", async (req, res) => {
  console.log("msg recieved");
  try {
    console.log(req.body);

    // 3. Tell front-end it worked.
    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0 });
  }
});
