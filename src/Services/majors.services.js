const pool = require("../DB/db");

async function getAllMajors() {
  try {
    const result = await pool.query("SELECT * FROM majors");
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getMajorById(id) {
  try {
    const result = await pool.query("SELECT * FROM majors WHERE major_id = ?", [
      id,
    ]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

async function createMajor(major) {
  try {
    const result = await pool.query(
      "INSERT INTO majors (major_name) VALUES (?) RETURNING *",
      [major]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}
async function getMajorsByIds(ids) {
  try {
    const placeholders = ids.map(() => "?").join(", ");
    const query = `SELECT * FROM majors WHERE major_id IN (${placeholders})`;
    const result = await pool.query(query, ids);
    return result[0];
  } catch (err) {
    throw err;
  }
}
async function getScreenMajors(screenNum) {
  let start;
  let finish;
  let ids = [];
  switch (Number(screenNum)) {
    case 1:
      start = 2;
      finish = 6;
      ids = [12, 13, 15, 16, 20];
      break;
    case 2:
      start = 7;
      finish = 11;
      ids = [14, 17, 18, 19, 21];
      break;
    case 3:
      start = 1;
      finish = 1;
      ids = [1];
      break;
    case 4:
      ids = [100];
      break;
    default:
      throw new Error("Invalid screen number");
  }

  try {
    // const result = await pool.query(
    //   "SELECT * FROM majors ORDER BY major_id LIMIT ? OFFSET ?",
    //   [finish - start + 1, start-1]
    // );
    const placeholders = ids.map(() => "?").join(", ");
    const query = `SELECT * FROM majors WHERE major_id IN (${placeholders})`;
    const result = await pool.query(query, ids);

    return result[0];
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getAllMajors,
  getMajorById,
  createMajor,
  getScreenMajors,
};
