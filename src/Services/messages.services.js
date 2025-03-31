const pool = require("../DB/db");
// בעיית הlocalhost
const getQuery = `SELECT 
    m.message_text, 
    m.study_year_id, 
    sy.study_year_name, 
    m.destination_date, 
    m.message_date, 
    mj.major_name,      
    CONCAT('http://localhost:3000', m.image_path) AS image_url,
    CONCAT('http://localhost:3000', b.background_path) AS background_url,
    b.background_name    
    FROM messages m
    LEFT JOIN backgrounds b ON m.background_id = b.background_id
    LEFT JOIN majors mj ON m.major_id = mj.major_id
    LEFT JOIN study_years sy ON m.study_year_id = sy.study_year_id;`;

    //השיטה היא להחזיר נתיב ולגשת

async function getAllMaessages() {
  try {
    const result = await pool.query(getQuery);
    return result.rows;
  } catch (err) {
    throw err;
  }
}
async function getMessageById(id) {
  try {
    const result = await pool.query(`${getQuery} WHERE message_id = $1`, [
      id,
    ]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

async function getMessagesByMajor(major_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM messages WHERE major_id = $1",
      [major_id]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
}

async function createMessage(message) {
  try {
    const result = await pool.query(
      "INSERT INTO messages (message) VALUES ($1) RETURNING *",
      [message]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

async function updateMessage(id, message) {
  try {
    const result = await pool.query(
      "UPDATE messages SET message = $1 WHERE id = $2 RETURNING *",
      [message, id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}

async function deleteMessage(id) {
  try {
    const result = await pool.query(
      "DELETE FROM messages WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}
