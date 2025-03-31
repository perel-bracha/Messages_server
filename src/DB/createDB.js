var mysql = require("mysql2");
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים

function createDB() {

    var connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
    
    connection.connect(function (err) {
      if (err) throw err;
      console.log(" first connected to mysql succied");
    });

    connection.query(`CREATE DATABASE ${process.env.DB_NAME}`, function (err, result) {
      if (err) throw err;
      console.log(`${process.env.DB_NAME} created`);
    });

}
createDB();
module.exports = createDB;