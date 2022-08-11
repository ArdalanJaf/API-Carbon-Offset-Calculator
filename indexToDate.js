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

    return (
      Number(month) +
      (index % 12) -
      (Number(month) + (index % 12) >= 12 ? 12 : 0)
    );
  };

  const getYear = (year) => {
    return Number(year) + Math.floor(index / 12);
  };

  const dateFormat = (month, year) => {
    return `${month}-${year.toString().slice(2, 4)}`;
  };

  return dateFormat(getMonth(startObject.month), getYear(startObject.year));
}

module.export = indexToDate;
// console.log(indexToDate(index));

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
