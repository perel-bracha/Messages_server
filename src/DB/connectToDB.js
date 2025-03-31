var path = require("path");
var mysql = require("mysql2");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים

// console.log(`DB_HOST: ${process.env.DB_HOST}`);
// console.log(`DB_USER: ${process.env.DB_USER}`);
// console.log(`DB_PASS: ${process.env.DB_PASS}`);
// console.log(`DB_NAME: ${process.env.DB_NAME}`);

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to ${process.env.DB_NAME} succied`);
});

module.exports = connection;
