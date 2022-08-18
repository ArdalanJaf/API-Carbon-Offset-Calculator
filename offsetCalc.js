function offsetCalc(data, config) {
  console.log("starting", data, config);
  try {
    const { annualCO2Emissions, treePurchases } = data;
    const { initial_cost, upkeep_cost, annual_offset, years_to_grow } = config;

    // Upon initialisation these values never change.
    const MONTHLY_EMISSIONS = decimalFix(
      (Number(annualCO2Emissions) * 1000) / 12,
      2
    ); // kg (would make more sense if data was sent in KG, not metric ton - or if there is API option to select)
    const MONTHLY_UPKEEP = Number(upkeep_cost) / 12;
    const INITIAL_COST = Number(initial_cost);
    const MONTHLY_OFFSET = Number(annual_offset) / 12;
    const MONTHS_TO_GROW = Number(years_to_grow) * 12;
    const FINAL_MONTH_INDEX =
      startMonthIndexGen(treePurchases[treePurchases.length - 1]) +
      MONTHS_TO_GROW;

    // Returned data obj.
    let result = {
      graphData: [], // { monthIndex: #, offset: #.###(kg), expenditure: #.##($ - NOT cents) }
      stats: {
        cost: { initial: 0, upkeep: 0, totalUpkeep: 0, grandTotal: 0 }, // #.##($ - NOT cents)
        trees: 0,
      },
    };
    let { graphData, stats } = result;

    // This function produces an array ("graphData") of objects. Each object represents 1 month and holds the communalitve CO2 offset and expenditure for all treePurchases.
    // Each treePurchase is assigned a monthIndex according to its date, in relation to the first treePurchase date (i.e. first purchase date = startMonthIndex 0).
    // Each for-loop starts inserting data from the startMonthIndex of a treePurchase object, respectively.
    // For each treePurchase the for-loop cycles through all the other months, calculating and adding offset & expenditure of that purchase to each month's total values.
    treePurchases.map((purchase) => {
      let startMonthIndex = startMonthIndexGen(purchase);
      let trees = Number(purchase.trees);

      for (let i = startMonthIndex; i <= FINAL_MONTH_INDEX; i++) {
        if (startMonthIndex === 0) {
          graphData[i] = {
            date: indexToUTC(i).getTime(),
            offset: 0,
            expenditure: 0,
          };
        }
        // Add offset
        graphData[i].offset = decimalFix(
          graphData[i].offset + offsetCalc(trees, i, startMonthIndex)
        );
        // Add expenditure
        graphData[i].expenditure = decimalFix(
          graphData[i].expenditure + costCalc(trees, i, startMonthIndex)
        );
      }
      // Add cumulative total stats
      stats.trees += trees;
      stats.cost.initial += decimalFix(trees * INITIAL_COST);
      stats.cost.totalUpkeep += decimalFix(
        trees * (MONTHLY_UPKEEP * (FINAL_MONTH_INDEX - startMonthIndex))
      );
    });
    // Add total stats

    stats.cost.upkeep = decimalFix(stats.trees * MONTHLY_UPKEEP);
    stats.cost.grandTotal = graphData[FINAL_MONTH_INDEX].expenditure;
    stats.monthlyEmissions = MONTHLY_EMISSIONS;
    stats.finalMonthlyOffset = graphData[FINAL_MONTH_INDEX].offset; // kg
    stats.carbonNeutralDate = getNeutralDate();
    stats.totalYears = Math.round(FINAL_MONTH_INDEX / 12);

    function getNeutralDate() {
      let neutralIndex = graphData.findIndex(
        (item) => item.offset >= MONTHLY_EMISSIONS
      );
      return neutralIndex < 0 ? null : graphData[neutralIndex].date;
    }

    return result;

    function startMonthIndexGen(object, startObject = treePurchases[0]) {
      // monthIndex is number of months from earliest purchase-entree date. The first tree purchase object will have startMonthIndex of 0.
      // e.g. with start date of 0/2022 (jan), 7/2030 (Aug) returns monthIndex of 103.
      return (
        12 -
        Number(startObject.month) +
        (Number(object.year) - (Number(startObject.year) + 1)) * 12 +
        Number(object.month)
      );
    }

    function offsetCalc(trees, i, startMonthIndex) {
      return (
        trees *
        //if tree is still growing
        (i < startMonthIndex + MONTHS_TO_GROW
          ? //add fraction of max offset based on how many days its grown
            (i - startMonthIndex) * (MONTHLY_OFFSET / MONTHS_TO_GROW)
          : // else add max offset
            MONTHLY_OFFSET)
      );
    }

    function costCalc(trees, i, startMonthIndex) {
      return trees * (MONTHLY_UPKEEP * (i - startMonthIndex) + INITIAL_COST);
    }

    function decimalFix(num, dPlaces = 2) {
      return Number(num.toFixed(dPlaces));
    }

    function indexToUTC(index, startObject = treePurchases[0]) {
      const { month, year } = startObject;
      return new Date(Number(year), Number(month) + Number(index), 1, 1, 0);
    }
  } catch (error) {
    return error;
  }
}

module.exports = offsetCalc;
