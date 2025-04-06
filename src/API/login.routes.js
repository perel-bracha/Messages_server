const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const loginServices = require('../Services/login.services');
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // בדיקת טעינת המשתנים הסביבתיים

const JWT_SECRET = process.env.JWT_SECRET; // עדיף לשים ב- .env

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const valid = await loginServices.validateLogin(username, password);
  if (!valid) {
    return res.status(401).json({ success: false, message: 'שם משתמש או סיסמה שגויים' });
  }

  // יצירת טוקן עם שם המשתמש וחותמת זמן
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });

  res.json({ success: true, token });
});

module.exports = router;
