// let index = 11;
// let treePurchases = [{ month: "11", year: "2022", trees: 1 }];

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

module.export = indexToDate;
// console.log(indexToDate(index));

// FIX YEAR

// let tD = { month: "4", year: "2024", trees: 1 };

// function startMonthIndexGen(object, startObject = treePurchases[0]) {
//   // monthIndex is number of months from earliest purchase-entree date. The first tree purchase object will have startMonthIndex of 0.
//   // e.g. with start date of 0/2022 (jan), 7/2030 (Aug) returns monthIndex of 103.
//   return (
//     12 -
//     Number(startObject.month) +
//     (Number(object.year) - (Number(startObject.year) + 1)) * 12 +
//     Number(object.month)
//   );
// }

let index = 11;
let treePurchases = [{ month: "11", year: "2022", trees: 1 }];

function indexToUTC(index, startObject = treePurchases[0]) {
  const { month, year } = startObject;

  return new Date(Number(year), Number(month) + Number(index), 1, 1, 0);
}

let date = indexToUTC(index);
let unix = date.getTime();

function unixToDate(unixStr, longM = false, longY = false) {
  const months = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let date = new Date(unixStr);
  let month = longM
    ? months[date.getMonth()]
    : months[date.getMonth()].slice(0, 3);
  let year = longY
    ? date.getFullYear()
    : date.getFullYear().toString().slice(-2);
  return `${month} ${year}`;
}

// console.log(unixToDate(unix, false, true));
// // console.log(unix);
// 0 - 11
// console.log( );

let obj = { initial_cost: "2", upkeep_cost: "200", annual_offset: "" };
function fn(obj) {
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
}

console.log(fn(obj));
