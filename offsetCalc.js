// Data format
// const data = {
//   annualCO2Emissions: "5.55",
//   treePurchases: [
//     { month: "0", year: "2022", trees: 20 },
//     { month: "4", year: "2023", trees: 30 },
//     { month: "9", year: "2023", trees: 42 },
//     { month: "0", year: "2024", trees: 55 },
//   ],
//   treeCost: { initial: "120", upkeep: "12", currency: "dollars" },
//   maxAnualPurchase: "55", // put in check to make sure they cannot buy beyond max (maybe on front?)
//   maxTreeOffset: {
//     annualOffset: "28.5",
//     yearsToGrow: "5",
//   },
// };

function offsetCalc(data) {
  const { treePurchases, treeCost, maxTreeOffset } = data;
  const monthlyUpkeep = Number(treeCost.upkeep) / 12;
  const initialCost = Number(treeCost.initial);
  const monthlyOffset = Number(maxTreeOffset.annualOffset) / 12;
  const monthsToGrow = Number(maxTreeOffset.yearsToGrow) * 12;

  // Total number of months from first purchase, upto complete growth of final trees purchase.
  const finalMonthIndex =
    startMonthIndexGen(treePurchases[treePurchases.length - 1]) + monthsToGrow; // e.g.  5 years for trees to grow = 60 months

  // returned data format
  let result = {
    graphData: [],
    stats: {
      trees: 0,
      annualOffset: 0,
      cost: { initial: 0, upkeep: 0, total: 0 },
    },
  };
  let { graphData, stats } = result;

  // This function produces an array ("graphData") of objects. Each object represents 1 month and holds the communalitve CO2 offset and expenditure - "{monthIndex, offset, expenditure}".
  // Each treePurchase is assigned a monthIndex according to its date, in relation to the first treePurchase date.
  // When the first treePurchase (monthIndex = 0) goes through the for-loop, it creates all the object, with calculated offset & expenditure per month for the first trees purchased.
  // All subsequent treePurchases ADD their respective calculated offset & expenditure per month to the objects created by the first loop (see above line).
  // All subsequent treePurchases use their respective monthIndex (eg. monthIndex = 20) to know at which object they should start adding data (eg. graphData[20]).
  treePurchases.map((purchase) => {
    let startMonthIndex = startMonthIndexGen(purchase);
    let trees = Number(purchase.trees);
    // console.log(purchase);

    for (let i = startMonthIndex; i <= finalMonthIndex; i++) {
      if (startMonthIndex === 0) {
        // treePurchases[0] creates graphData objects
        graphData[i] = {
          monthIndex: i,
          offset: decimalFix(offsetCalc(trees, i, startMonthIndex)),
          expenditure: costCalc(trees, i, startMonthIndex),
        };
      } else {
        // treePurchases[>0] add to graphData objects
        graphData[i].offset = decimalFix(
          graphData[i].offset + offsetCalc(trees, i, startMonthIndex)
        );
        graphData[i].expenditure =
          graphData[i].expenditure + costCalc(trees, i, startMonthIndex);
      }
    }
    // Add cumulative total stats
    stats.trees += trees;
    stats.cost.initial += trees * initialCost;
    stats.cost.upkeep +=
      trees * (monthlyUpkeep * (finalMonthIndex - startMonthIndex));
  });
  // Add total stats
  stats.cost.total = graphData[finalMonthIndex].expenditure;
  stats.annualOffset = (graphData[finalMonthIndex].offset * 12) / 1000;

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

  function decimalFix(num, dPlaces = 3) {
    return Number(num.toFixed(dPlaces));
  }
}

console.log(offsetCalc(data));

// Improve: add decimal handler for when treeCosts are decimal numbers (eg. upkeep: "12.31")
