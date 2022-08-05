const decimalAdjust = require("./util/decimalAdjust");

const treePurchases = [
  { month: "0", year: "2022", trees: 1 },
  { month: "9", year: "2023", trees: 1 },
  { month: "4", year: "2025", trees: 1 },
  { month: "0", year: "2027", trees: 1 },
];

const maxTreeOffset = {
  annualOffset: "28.5",
  yearsToGrow: "5",
};

const start = {
  month: Number(treePurchases[0].month),
  year: Number(treePurchases[0].year),
};
const monthlyOffset = Number(maxTreeOffset.annualOffset) / 12;
const monthsToGrow = Number(maxTreeOffset.yearsToGrow) * 12;
const finalMonthIndex =
  startMonthIndexGen(treePurchases[treePurchases.length - 1]) + monthsToGrow; // 5 years for trees to grow, +1 to see maximum CO2 offset

function startMonthIndexGen(object) {
  // monthIndex is number of months from earliest purchase-entree date. e.g. with start date of 0/2022 (jan), 7/2030 (Aug) returns monthIndex of 103.
  return (
    12 -
    start.month +
    (Number(object.year) - (start.year + 1)) * 12 +
    Number(object.month)
  );
}

function offsetCalc(trees, i, startMonthIndex) {
  return (
    Number(trees) *
    //if tree is still growing
    (i < startMonthIndex + monthsToGrow
      ? //add fraction of max offset based on how many days its grown
        (i - startMonthIndex) * (monthlyOffset / monthsToGrow)
      : // else add max offset
        monthlyOffset)
  );
  // improvements: find way to deal with pesky decimals...
}

function dataMapper(data) {
  let result = [];

  data.map((object) => {
    let objMonthIndex = startMonthIndexGen(object);
    for (let i = objMonthIndex; i <= finalMonthIndex; i++) {
      if (objMonthIndex === 0) {
        // The first loop applies for-loop to first treePurchase object, creating all new objects in results.
        result[i] = {
          num: i,
          offset: offsetCalc(object.trees, i, objMonthIndex),
        };
      } else {
        // Data taken from successive treePurchase objects is add to the created objects in results.
        result[i].offset += offsetCalc(object.trees, i, objMonthIndex);
      }
    }
  });
  console.log(result);
}

dataMapper(treePurchases);
console.log(Math.round(8.629166666666666 * 100) / 100);
