// const pConnection = require("./mySQL/connection.js");
const express = require("express");
const router = express.Router();
module.exports = router;
const offsetCalc = require("./offsetCalc");

router.post("/calculate", async (req, res) => {
  try {
    const resultData = await offsetCalc(req.body);
    res.send({ status: 1, resultData });
  } catch (error) {
    res.send({ status: 0 });
  }
});
