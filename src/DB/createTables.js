const conDB = require("./connectToDB");
const fs = require("fs");
const path = require("path");
const query = fs.readFileSync(
  path.join(__dirname, "sqlTables", "backgrounds.sql"),
  "utf8"
);
function createTable(query, tableName) {
  return new Promise((resolve, reject) => {
    conDB.query(query, (err, result) => {
      if (err) return reject(err);
      console.log(`${tableName} table created`);
      resolve(result);
    });
  });
}

async function createTables() {
  const tableFiles = [
    // "./sqlTables/backgrounds.sql",
    // "./sqlTables/majors.sql",
    // "./sqlTables/study_years.sql",
    // "./sqlTables/messages.sql",
    path.join(__dirname, "sqlTables", "backgrounds.sql"),
    path.join(__dirname, "sqlTables", "majors.sql"),
    path.join(__dirname, "sqlTables", "study_years.sql"),
    path.join(__dirname, "sqlTables", "messages.sql"),
  ];
  
  for (const file of tableFiles) {
    const query = fs.readFileSync(file, "utf8");
    // const tableName = file.split("/").pop().split(".")[0];
    const tableName = path.basename(file, ".sql"); // הוצאת שם הטבלה מתוך שם הקובץ
    await createTable(query, tableName);
  }
}
createTables();
module.exports = createTables;
