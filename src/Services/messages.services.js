const pool = require("../DB/db");
const ExcelJS = require("exceljs");
const e = require("express");
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים

// בעיית הlocalhost
const getQuery = `SELECT 
    m.message_id,
    m.major_id,
    m.message_text, 
    m.study_year_id, 
    sy.study_year_name, 
    m.destination_date, 
    m.message_date, 
    mj.major_name,      
    CONCAT('${process.env.URL}', m.image_path) AS image_url,
    CONCAT('${process.env.URL}', b.background_path) AS background_url,
    b.background_name    
    FROM messages m
    LEFT JOIN backgrounds b ON m.background_id = b.background_id
    LEFT JOIN majors mj ON m.major_id = mj.major_id
    LEFT JOIN study_years sy ON m.study_year_id = sy.study_year_id`;




async function getAllMaessages(filters = {}) {
  try {
    let query = `${getQuery} WHERE 1=1`; // בסיס השאילתה
    const params = [];

    // סינון לפי תאריך ההודעה
    if (filters.message_start_date) {
      query += " AND m.message_date >= ?";
      params.push(filters.message_start_date);
    }
    if (filters.message_end_date) {
      query += " AND m.message_date <= ?";
      params.push(filters.message_end_date);
    }

    // סינון לפי תאריך יעד
    if (filters.destination_start_date) {
      query += " AND m.destination_date >= ?";
      params.push(filters.destination_start_date);
    }
    if (filters.destination_end_date) {
      query += " AND m.destination_date <= ?";
      params.push(filters.destination_end_date);
    }

    // סינון לפי טקסט מגמה
    if (filters.major_name) {
      query += " AND mj.major_name LIKE ?";
      params.push(`%${filters.major_name}%`);
    }

    // סינון לפי שנת לימודים
    if (filters.study_year_name) {
      query += " AND sy.study_year_name LIKE ?";
      params.push(`%${filters.study_year_name}%`);
    }

    // סינון לפי טקסט ההודעה
    if (filters.message_text) {
      query += " AND m.message_text LIKE ?";
      params.push(`%${filters.message_text}%`);
    }

    // ביצוע השאילתה
    const [result] = await pool.query(query, params);
    return result;
  } catch (err) {
    throw err;
  }
}
async function getMessageById(id) {
  try {
    const result = await pool.query(`${getQuery} WHERE message_id = ?`, [id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}
async function getMessagesByMajor(major_id) {
  try {
    const result = await pool.query(
      `${getQuery} WHERE m.major_id = ?`,
      [major_id]
    );
    return result[0];
  } catch (err) {
    throw err;
  }
}
async function getMessagesRelevantByMajor(major_id) {
  try {
    const result = await pool.query(
      `${getQuery} WHERE m.major_id = ? AND m.destination_date >= CURDATE()`,
      [major_id]
    );
    return result[0];
  } catch (err) {
    throw err;
  }
}
async function createMessage(message) {
  try {
    const [result] = await pool.query(
      `INSERT INTO messages (destination_date, major_id, study_year_id, message_text, image_path, background_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        message.destination_date,
        message.major_id,
        message.study_year_id,
        message.message_text,
        message.image_path,
        message.background_id,
      ]
    );
    return { id: result.insertId, ...message };
  } catch (err) {
    throw err;
  }
}

async function updateMessage(id, message) {
  try {
    const result = await pool.query(
      "UPDATE messages SET ? WHERE message_id = ?",
      [message, id]
    );
    console.log();
    
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function deleteMessage(id) {
  try {
    console.log("DELETE FROM messages WHERE id = ?", [id]);
    const result = await pool.query("DELETE FROM messages WHERE message_id = ?", [id]);
    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function exportMessagesToExcel(filters) {
  try {
    const messages = await getAllMaessages(filters); // קבלת כל ההודעות
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Messages");

    // הוספת כותרות לעמודות
    worksheet.columns = [
      { header: "תאריך", key: "message_date", width: 20 },
      { header: "תאריך עברי", key: "message_date_hebrew", width: 25 },
      { header: "תאריך יעד", key: "destination_date", width: 20 },
      { header: "תאריך יעד עברי", key: "destination_date_hebrew", width: 25 },
      { header: "שנת לימודים", key: "study_year_name", width: 15 },
      { header: "מגמה", key: "major_name", width: 20 },
      { header: "טקסט", key: "message_text", width: 30 },
      { header: "קובץ", key: "image_url", width: 40 },
    ];

    // הוספת תאריך עברי לכל הודעה
    messages.forEach((message) => {
      const destinationDate = new Date(message.destination_date);
      const messageDate = new Date(message.message_date);
      message.destination_date_hebrew = toHebrewDate(destinationDate);
      message.message_date_hebrew = toHebrewDate(messageDate);
    });

    // הוספת נתונים לשורות
    messages.forEach((message) => {
      worksheet.addRow(message);
    });

    // שמירת הקובץ כ-Buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (err) {
    throw err;
  }
}

function toHebrewDate(date) {
  return new Intl.DateTimeFormat("he-IL-u-ca-hebrew", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
    .format(new Date(date))
    .replace(/\d+/g, (day) => {
      const hebrewDays = [
        "א",
        "ב",
        "ג",
        "ד",
        "ה",
        "ו",
        "ז",
        "ח",
        "ט",
        "י",
        "יא",
        "יב",
        "יג",
        "יד",
        "טו",
        "טז",
        "יז",
        "יח",
        "יט",
        "כ",
        "כא",
        "כב",
        "כג",
        "כד",
        "כה",
        "כו",
        "כז",
        "כח",
        "כט",
        "ל",
      ];
      return hebrewDays[day - 1];
    });
}


module.exports = {
  getAllMaessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  exportMessagesToExcel,
  getMessagesByMajor,
  getMessagesRelevantByMajor,
};
