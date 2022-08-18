const pConnection = require("./mySQL/connection.js");
const express = require("express");
const router = express.Router();
module.exports = router;
const offsetCalc = require("./offsetCalc");
const queries = require("./mySQL/queries.js");
const defaultConfig = require("./defaultOffsetConfig");

router.post("/calculate", async (req, res) => {
  try {
    // get config
    let config = await pConnection(queries.getConfig());
    config = await Object.values(JSON.parse(JSON.stringify(config)))[0];
    // let config = defaultConfig; // no SQL db? use this instead

    // calculate carbon offset data
    const resultData = await offsetCalc(req.body, config);

    // return data to front
    res.send({ status: 1, resultData });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

// get config data
router.get("/get_config", async (req, res) => {
  try {
    let result = await pConnection(queries.getConfig());
    res.send({ status: 1, result });
  } catch (error) {
    res.send({ status: 0, error });
  }
});

// reset config data to default values
router.post("/reset_config", async (req, res) => {
  try {
    let result = await pConnection(queries.resetConfig());
    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0 });
  }
});

// update config data
router.post("/update_config", async (req, res) => {
  try {
    if (Object.keys(req.body).length > 0) {
      let result = await pConnection(queries.updateConfig(req.body));
      console.log("done", result);
    }
    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0 });
  }
});
