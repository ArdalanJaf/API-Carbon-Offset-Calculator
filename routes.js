const pConnection = require("./mySQL/connection.js");
const express = require("express");
const router = express.Router();
module.exports = router;
const offsetCalc = require("./offsetCalc");
const queries = require("./mySQL/queries.js");

router.post("/calculate", async (req, res) => {
  try {
    console.log("recieved");
    // get config
    let config = await pConnection(queries.getConfig());

    // convert RawDataPacket to object
    config = await Object.values(JSON.parse(JSON.stringify(config)))[0];

    // calculate carbon offset data
    const resultData = await offsetCalc(req.body, config);

    // return data to front
    res.send({ status: 1, resultData });
  } catch (error) {
    res.send({ status: 0 });
  }
});

router.post("/update_config", async (req, res) => {
  try {
    let result = await pConnection(queries.updateConfig(req.body));
    console.log("done", result);
    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0 });
  }
});
