// Data
const treePurchases = [
  { month: "0", year: "2022", trees: 1 },
  { month: "4", year: "2023", trees: 1 },
  { month: "9", year: "2023", trees: 1 },
  { month: "0", year: "2024", trees: 1 },
];
const treeCost = { initial: "120", upkeep: "12", currency: "dollars" };

const maxTreeOffset = {
  annualOffset: "28.5",
  yearsToGrow: "5",
};

// Function
const { annualOffset, yearsToGrow } = maxTreeOffset;
const { initial, upkeep } = treeCost;
const monthlyUpkeep = Number(treeCost.upkeep) / 12;
const initialCost = Number(treeCost.initial);
const monthlyOffset = Number(annualOffset) / 12;
const monthsToGrow = Number(yearsToGrow) * 12;
const finalMonthIndex =
  startMonthIndexGen(treePurchases[treePurchases.length - 1]) + monthsToGrow; // 5 years for trees to grow = 60 months to grow

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

function decimalFix(num, dPlaces = 3) {
  return Number(num.toFixed(dPlaces));
}

function costCalc(
  trees,
  i,
  startMonthIndex,
  mode = undefined,
  mUpkeep = monthlyUpkeep,
  iCost = initialCost
) {
  return mode === "initial"
    ? trees * iCost
    : mode === "upkeep"
    ? trees * (mUpkeep * (i - startMonthIndex))
    : trees * (mUpkeep * (i - startMonthIndex) + iCost);
}

function dataMapper(data) {
  let result = {
    graphData: [],
    stats: {
      trees: 0,
      annualOffset: 0,
      cost: { initial: 0, upkeep: 0, total: 0 },
    },
  };
  let { graphData, stats } = result;

  data.map((purchase) => {
    let startMonthIndex = startMonthIndexGen(purchase);
    let trees = Number(purchase.trees);

    for (let i = startMonthIndex; i <= finalMonthIndex; i++) {
      if (startMonthIndex === 0) {
        // The first loop CREATES all new objects in results, calculating offset & cost based on first tree purchase.
        graphData[i] = {
          monthIndex: i,
          offset: decimalFix(offsetCalc(trees, i, startMonthIndex)),
          expenditure: costCalc(trees, i, startMonthIndex),
        };
        // stats.initialCost = costCalc(trees, i, startMonthIndex, "initial");
        // stats.upkeepCost = costCalc(trees, i, startMonthIndex, "upkeep");
      } else {
        // All other loops ADDS calculated offset & cost to existing objects.
        graphData[i].offset = decimalFix(
          graphData[i].offset + offsetCalc(trees, i, startMonthIndex)
        );
        graphData[i].expenditure =
          graphData[i].expenditure + costCalc(trees, i, startMonthIndex);
      }
    }
    //
    stats.trees += trees;
    stats.cost.initial += trees * initialCost;
    stats.cost.upkeep +=
      trees * (monthlyUpkeep * (finalMonthIndex - startMonthIndex));
  });
  stats.cost.total = graphData[finalMonthIndex].expenditure;
  stats.annualOffset = graphData[finalMonthIndex].offset * 12;

  return result;
}

let testRun = dataMapper(treePurchases);
console.log(testRun);

// 120 + (1*76) = 196
// 120 + (1*60) = 180
// total: 376
