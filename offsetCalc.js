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
    const monthlyUpkeep = Number(treeCost.upkeep) / 12;
    const initialCost = Number(treeCost.initial);
    const monthlyOffset = Number(maxTreeOffset.annualOffset) / 12;
    const monthsToGrow = Number(maxTreeOffset.yearsToGrow) * 12;
    const finalMonthIndex =
      startMonthIndexGen(treePurchases[treePurchases.length - 1]) +
      monthsToGrow; // e.g.  5 years for trees to grow = 60 months
    // Total number of months from first purchase, upto complete growth of final trees purchase.

    // returned data format
    let result = {
      graphData: [], // { monthIndex: #, offset: #.###(kg), expenditure: #.##($ - NOT cents) }
      stats: {
        trees: 0,
        annualCO2Emissions: decimalFix(Number(annualCO2Emissions), 2),
        annualOffset: 0, // metric tons
        cost: { initial: 0, upkeep: 0, total: 0 }, // #.##($ - NOT cents)
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

      for (let i = startMonthIndex; i <= finalMonthIndex; i++) {
        if (startMonthIndex === 0) {
          graphData[i] = {
            date: indexToDate(i),
            offset: 0,
            expenditure: 0,
          };
        }
        // Add offset
        graphData[i].offset = decimalFix(
          graphData[i].offset + offsetCalc(trees, i, startMonthIndex),
          3
        );
        // Add expenditure
        graphData[i].expenditure = decimalFix(
          graphData[i].expenditure + costCalc(trees, i, startMonthIndex)
        );
      }
      // Add cumulative total stats
      stats.trees += trees;
      stats.cost.initial += decimalFix(trees * initialCost);
      stats.cost.upkeep += decimalFix(
        trees * (monthlyUpkeep * (finalMonthIndex - startMonthIndex))
      );
    });
    // Add total stats
    stats.cost.total = graphData[finalMonthIndex].expenditure;
    stats.annualOffset = (graphData[finalMonthIndex].offset * 12) / 1000; // metric tons

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
        (i < startMonthIndex + monthsToGrow
          ? //add fraction of max offset based on how many days its grown
            (i - startMonthIndex) * (monthlyOffset / monthsToGrow)
          : // else add max offset
            monthlyOffset)
      );
    }

    function costCalc(
      trees,
      i,
      startMonthIndex,
      mUpkeep = monthlyUpkeep,
      iCost = initialCost
    ) {
      return trees * (mUpkeep * (i - startMonthIndex) + iCost);
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
        return `${month}-${year.toString().slice(2, 4)}`;
      };

      return dateFormat(getMonth(startObject.month), getYear(startObject.year)); //{timetamp for 1/month/year} || {"Sep 01"}
    }
  } catch (error) {
    return error;
  }
}

module.exports = offsetCalc;
