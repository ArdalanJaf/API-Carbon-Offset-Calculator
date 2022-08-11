// // Data format
// const data = {
//   annualCO2Emissions: "5.55", // metric tons (5550 kg)
//   treePurchases: [
//     { month: "0", year: "2022", trees: 1 },
//     { month: "11", year: "2024", trees: 1 },
//     // { month: "9", year: "2023", trees: 42 },
//     // { month: "0", year: "2024", trees: 55 },
//   ],
//   config: {
//     treeCost: {
//       initial: "120",
//       upkeep: "12",
//       currency: "dollars",
//       inflationRate: "",
//     },
//     maxTreeOffset: {
//       annualOffset: "28.5", //kg
//       yearsToGrow: "5", //years
//     },
//   },
// };

function offsetCalc(data) {
  try {
    const { annualCO2Emissions, treePurchases } = data;
    const { treeCost, maxTreeOffset } = data.config;

    // Upon initialisation these values never change.
    const MONTHLY_UPKEEP = Number(treeCost.upkeep) / 12;
    const INITIAL_COST = Number(treeCost.initial);
    const MONTHLY_OFFSET = Number(maxTreeOffset.annualOffset) / 12;
    const MONTHS_TO_GROW = Number(maxTreeOffset.yearsToGrow) * 12;
    const FINAL_MONTH_INDEX =
      startMonthIndexGen(treePurchases[treePurchases.length - 1]) +
      MONTHS_TO_GROW;

    // Returned data format.
    let result = {
      graphData: [], // { monthIndex: #, offset: #.###(kg), expenditure: #.##($ - NOT cents) }
      stats: {
        trees: 0,
        annualCO2Emissions: decimalFix(Number(annualCO2Emissions), 2),
        annualOffset: 0, // metric tons
        cost: { initial: 0, upkeep: 0, totalUpkeep: 0, grandTotal: 0 }, // #.##($ - NOT cents)
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
            date: indexToDate(i),
            offset: 0,
            expenditure: 0,
            emissions: decimalFix((Number(annualCO2Emissions) * 1000) / 12),
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

    stats.totalYears = Math.round(FINAL_MONTH_INDEX / 12);
    stats.cost.upkeep = decimalFix(stats.trees * MONTHLY_UPKEEP);
    stats.cost.grandTotal = graphData[FINAL_MONTH_INDEX].expenditure;
    stats.annualOffset = (graphData[FINAL_MONTH_INDEX].offset * 12) / 1000; // metric tons
    stats.carbonNeutralDate =
      graphData[
        graphData.findIndex(
          (item) => item.offset >= (Number(annualCO2Emissions) * 1000) / 12
        )
      ].date;
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

    function indexToDate(index, startObject = treePurchases[0]) {
      const getMonth = (month) => {
        let months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        return months[
          Number(month) +
            (index % 12) -
            (Number(month) + (index % 12) >= 12 ? 12 : 0)
        ];
      };

      const getYear = (year) => {
        return Number(year) + Math.floor(index / 12);
      };

      const dateFormat = (month, year) => {
        return `${month} ${year.toString()}`;
      };

      return dateFormat(getMonth(startObject.month), getYear(startObject.year));
    }

    // function indexToUTC(index, startObject = treePurchases[0]) {
    //   const { month, year } = startObject;
    //   return new Date(Number(year), Number(month) + Number(index), 1, 1, 0);
    // }
  } catch (error) {
    return error;
  }
}

module.exports = offsetCalc;
