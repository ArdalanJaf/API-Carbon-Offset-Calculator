const queries = {
  getConfig: function () {
    return `SELECT initial_cost, upkeep_cost, annual_offset, years_to_grow 
                FROM offset_simulator_config
                    WHERE id = "custom"`;
  },

  resetConfig: function (obj) {
    return `UPDATE offset_simulator_config  
               SET 
                initial_cost="DEFAULT", 
                upkeep_cost="DEFAULT", 
                annual_offset="DEFAULT", 
                years_to_grow="DEFAULT"
                      WHERE id="custom"
`;
  },

  updateConfig: function (obj) {
    return `UPDATE offset_simulator_config  
                SET 
                ${obj.initial_cost ? `initial_cost=${obj.initial_cost}` : ""} 
                ${
                  obj.upkeep_cost
                    ? `${obj.initial_cost ? `,` : ""} upkeep_cost=${
                        obj.upkeep_cost
                      }`
                    : ""
                } 
                ${
                  obj.annual_offset
                    ? `${obj.upkeep_cost ? `,` : ""} annual_offset="${
                        obj.annual_offset
                      }`
                    : ""
                }
                ${
                  obj.years_to_grow
                    ? `${obj.annual_offset ? `,` : ""} years_to_grow=${
                        obj.years_to_grow
                      }`
                    : ""
                }
                    WHERE id="custom"
    `;
  },
};

module.exports = queries;

// Query that either changes sql field if given new value, or returns sql field to default.

// updateConfig: function (obj) {
// return `UPDATE offset_simulator_config
//             SET initial_cost=${obj.initial_cost || "DEFAULT"},
//             upkeep_cost=${obj.upkeep_cost || "DEFAULT"},
//             annual_offset=${obj.annual_offset || "DEFAULT"},
//             years_to_grow=${obj.years_to_grow || "DEFAULT"}
//                 WHERE id="custom"
// `;
// },
