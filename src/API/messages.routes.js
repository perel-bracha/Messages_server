const {Router} = require('express');
const { getAllMaessages, createMessage, updateMessage, deleteMessage, getMessageById, exportMessagesToExcel } = require('../Services/messages.services');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/images')); // יעד הקובץ
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // שם קובץ ייחודי
  }
});

const upload = multer({ storage: storage });


router.get('/', async (req, res) => {
  try {
      const messages = await getAllMaessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.get("/export", async (req, res) => {
  console.log("export route");
  
  try {
    const excelBuffer = await exportMessagesToExcel();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=messages.xlsx"
    );
    res.send(excelBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export messages to Excel" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const message = await getMessageById(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/', upload.single('image_path'), async (req, res) => {
  console.log("POST /messages", req.body);
  try {
    const  {message} = req.body;

    if (req.file) {
      message.image_path = `/public/images/${req.file.filename}`;
      console.log(`after image_path`, message);
    }

    const newMessage = await createMessage(message);
    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
// router.post('/', async (req, res) => {
//   try {
//     const  message  = req.body;
//     const newMessage = await createMessage(message);
//     res.status(201).json(newMessage);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteMessage(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const updatedMessage = await updateMessage(id, message);
    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;