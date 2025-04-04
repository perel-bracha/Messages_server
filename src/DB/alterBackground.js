const conDB=require('./connectToDB');
conDB.query('ALTER TABLE messages MODIFY background_id int;');