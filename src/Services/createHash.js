const bcrypt = require('bcrypt');

const password = 'hodaotofakim25'; // כאן שימי את הסיסמה הרצויה
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) throw err;
  console.log('Hash:', hash);
});

// const bcrypt = require('bcrypt');
// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question('הקלד/י את הסיסמה שברצונך להצפין: ', async (password) => {
//   const saltRounds = 10;
//   try {
//     const hash = await bcrypt.hash(password, saltRounds);
//     console.log('\nהעתק/י את השורה הבאה לקובץ .env:\n');
//     console.log(`ADMIN_PASSWORD_HASH=${hash}`);
//   } catch (err) {
//     console.error('אירעה שגיאה:', err.message);
//   } finally {
//     rl.close();
//   }
// });