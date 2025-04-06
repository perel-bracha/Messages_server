var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים
const bcrypt = require('bcryptjs');

const adminUsername = process.env.ADMIN_USERNAME;
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

async function validateLogin(username, password) {
  if (username !== adminUsername) return false;
  const match = await bcrypt.compare(password, adminPasswordHash);
  return match;
}

module.exports = { validateLogin };