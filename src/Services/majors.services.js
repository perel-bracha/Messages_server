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
    const result = await pool.query(
      "SELECT * FROM majors WHERE major_id = ?",
      [id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

async function getMessagesByMajor(major_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM messages WHERE major_id = ?",
      [major_id]
    );
    return result.rows;
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
module.exports = {
  getAllMajors,
  getMessagesByMajor,
  getMajorById,
  createMajor,
};
