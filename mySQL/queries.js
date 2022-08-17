const queries = {
  // no obj = reset to default
  updateConfig: function (obj) {
    return `UPDATE offset_simulator_config  
                SET initial_cost=${obj.initialCost || "DEFAULT"}, upkeep_cost=${
      obj.upkeepCost || "DEFAULT"
    }, annual_offset=${obj.annualOffset || "DEFAULT"} , years_to_grow=${
      obj.yearsToGrow || "DEFAULT"
    }
                    WHERE id="custom"
    `;
  },
  getConfig: function () {
    return `SELECT initial_cost, upkeep_cost, annual_offset, years_to_grow 
                FROM offset_simulator_config
                    WHERE id = "custom"`;
  },
};

module.exports = queries;
