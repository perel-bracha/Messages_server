const conDB = require("./connectToDB");
const fs = require("fs");
const path = require("path");
const { pool } = require("./db");
const backgroundsDir = path.join(__dirname, "../../public/backgrounds"); // Define the directory path

async function initializeDB() {
  const insertStudy_years = `INSERT INTO study_years (study_year_name) VALUES ('כללי'), ('א'), ('ב'), ('ג');`;

  const insertMajors = `INSERT INTO majors (major_name) VALUES
('כללי'),
('אמנות'),
('אנגלית'),
('גרפיקה'),
('מחנכות'),
('חינוך מיוחד'),
('יעוץ מס'),
('מחשבים'),
('מחשבים מתוגבר'),
('מתמטיקה')`;

  // const insertBackgrounds = `INSERT INTO backgrounds (background_name) VALUES`;

  const files = fs.readdirSync(backgroundsDir);
  for (const file of files) {
    const imagePath = `/public/backgrounds/${file}`;
    const imageName = path.basename(file, path.extname(file)); // שם הקובץ בלי הסיומת

    await conDB.execute(
      "INSERT INTO backgrounds (background_name, background_path) VALUES (?, ?) ON DUPLICATE KEY UPDATE background_path = VALUES(background_path)",
      [imageName, imagePath]
    );
  }
  console.log("Initial backgrounds inserted");
  
  await conDB.promise().query(insertStudy_years);
  console.log("Initial study_years inserted");

  await conDB.promise().query(insertMajors);
  console.log("Initial majots inserted");

  
}

initializeDB();
module.exports = initializeDB;
