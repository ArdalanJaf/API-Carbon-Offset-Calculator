import random from "numpy";

const date = {
    annualCO2Emissions: "5.55",
    treePurchases: [{ month: "1", year: "2022", trees: "10" }, { month: "7", year: "2022", trees: "10" },{ month: "1", year: "2023", trees: "10" }, { month: "7", year: "2023", trees: "10" }],
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

// tree: 28.5kg /year   month1 = 0kg -> month 61 = 28.5kg (exponential)

// person: 5.55 tons => 5550kg /year

// how many trees to be neutral? 5550 / 28.5 = 195 trees

const timeForFullOffset
const annualEmmission = data.annualCO2Emissions


function 