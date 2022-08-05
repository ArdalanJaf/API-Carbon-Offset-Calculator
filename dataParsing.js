const data = {
  annualCO2Emissions: "5.55",
  treePurchases: [
    { month: "0", year: "2022" },
    { month: "2", year: "2023" },
    { month: "4", year: "2026" },
    { month: "7", year: "2030" },
  ],
  treeCost: { initial: "120", upkeep: "12", currency: "dollars" },
  maxAnualPurchase: "55",
  maxTreeOffset: {
    anualOffset: "28.5",
    maxGrowTime: "5",
  },
};
//outputs:
// How long to get carbon neutral?
// How much it cost?

// each tree-purchase entry output => [ {month: 1, offset: 0}, {month: 2, offset: 12}, {month: 3, offset: 24}, etc]
// And then we add them all together

const { annualCO2Emissions, treePurchases, maxTreeOffset } = data;
const start = {
  month: Number(treePurchases[0].month),
  year: Number(treePurchases[0].year),
};

const finalMonthIndex =
  monthIndexGen(treePurchases[treePurchases.length - 1]) +
  Number(maxTreeOffset.maxGrowTime) * 12 +
  1; // 5 years for trees to grow, +1 to see maximum CO2 offset

// Need to sort it first to make sure they are in order!!
function monthIndexGen(object) {
  // monthIndex is number of months from earliest purchase-entree date. e.g. with start date of 0/2022 (jan), 7/2030 (Aug) returns monthIndex of 103.
  return (
    12 -
    start.month +
    (Number(object.year) - (start.year + 1)) * 12 +
    Number(object.month)
  );
}
// console.log(monthIndexGen(treePurchases[treePurchases.length - 1]));

function expoArrayItemGen(object) {
  // {month: "1", year: "2024", trees: "10"} -> {monthIndex: 21, offset: }
  return {
    monthIndex: monthIndexGen(object),
  };
}
// console.log(treePurchases[3], monthIndexGen(treePurchases[3]));

function expoArrayGen(object) {
  // input: tree-purchase entree, output: array of objects with monthIndex and CO2 offset
  let arr = [];
  for (let i = monthIndexGen(object); i <= finalMonthIndex; i++) {
    arr.push({ monthIndex: i, emissions: null });
  }
  return arr;
}
// {} start with single treepurchase object
// [{},{},{},{}] turn treepurchase object into array of monthly CO2 offset values (do same to all)
// [[{},{},{}], [{},{},{}]]? reduce all to one array with Offset values added together.
// [{}{}{}{}{}] end up with 1 array, with total Offset per month

// [{}{}{}] make single array from first purchase object
// [{}{}{}{}{}{}{}]: based on month, add values, if no object, create object with your value PLUSS the previous value
// eg. treePurchases.map((purchase)=> { getMonthIndexAndOffset(purchase) = offsetArray, array[monthIndex].offset += offset  if no object for monthIndex, create object (adding previous object's offset)})

// [{}{}{}{}] create array of empty objects, same number as FinalMonthIndex
// [{.}{.}{.}{.}] map through treePurchases
// eg. treePurchases.map((purchase)=> { getMonthIndexAndOffset(purchase) = [{}{}{}], array[monthIndex].offset += offset  if no object for monthIndex, create object (adding previous object's offset)})

// console.log(expoArrayGen(treePurchases[3]));
// tree: 28.5kg /year   month1 = 0kg -> month 61 = 28.5kg (exponential)

// person: 5.55 tons => 5550kg /year

// how many trees to be neutral? 5550 / 28.5 = 195 trees

const timeForFullOffset = null;
const annualEmmission = annualCO2Emissions;

l;
