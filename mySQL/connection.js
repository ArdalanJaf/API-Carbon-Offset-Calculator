const mysql = require("mysql");

const connection = mysql.createPool({
  connectionLimit: 10,
  database: process.env.DBDATABASE,
  user: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
});

function pConnection(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        console.log("SQL rejected request: " + err);
        reject();
      }
      resolve(results);
    });
  });
}
module.exports = pConnection;
