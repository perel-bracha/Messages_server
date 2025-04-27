const { Router } = require("express");
// const { fromPath } = require("pdf2pic");
// const { convert } = require('pdf-poppler');

const fs = require("fs");

const {
  getAllMaessages,
  createMessage,
  updateMessage,
  deleteMessage,
  getMessageById,
  exportMessagesToExcel,
} = require("../Services/messages.services");
const path = require("path");
const multer = require("multer");
const e = require("express");
const router = Router();

module.exports = (io) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../../public/images")); // יעד הקובץ
    },
    filename: (req, file, cb) => {
      // cb(null, file.originalname); // שמירת הקובץ בשם המקורי שלו
      cb(null, Date.now() + path.extname(file.originalname)); // שם קובץ ייחודי
    },
  });

  const upload = multer({ storage: storage });

  router.get("/", async (req, res) => {
    try {
      const filters = req.query; // קבלת פרמטרים לסינון מהבקשה
      const messages = await getAllMaessages(filters);
      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/export", async (req, res) => {
    console.log("export route");
    const filters = req.query; // קבלת פרמטרים לסינון מהבקשה

    try {
      const excelBuffer = await exportMessagesToExcel(filters);
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

  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const message = await getMessageById(id);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/", async (req, res) => {
    console.log("POST /messages", req.body);
    try {
      const message = req.body;

      if (req.file) {
        message.image_path = `/public/images/${req.file.filename}`;
        console.log(`after image_path`, message);
      }

      const newMessage = await createMessage(message);
      // שליחת אירוע ללקוח על הוספת הודעה
      io.emit("message_event", { event: "create", data: newMessage });

      res.status(201).json(newMessage);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
  router.post(
    "/upload_image",
    upload.single("image_path"),
    async (req, res) => {
      console.log("POST /messages/upload", req.body);
      const filePath = `/public/images/${req.file.filename}`;
      res.status(201).json({ filePath });
    }
  );


  // router.post("/", async (req, res) => {
  //   console.log("POST /messages", req.body);
  //   try {
  //     const message = req.body;

  //     if (message.image_path) {
  //       if (message.image_path.endsWith(".pdf")) {
  //         const filePath = path.join(
  //           __dirname,
  //           "../../public/images",
  //           message.image_path
  //         );
  //         console.log(`filePath`, filePath);
  //         console.log(`savePath`, path.join(__dirname, "../../public/images"));
  //         const outputDir = path.join(__dirname, "../../public/images");
  //         if (!fs.existsSync(outputDir)) {
  //           fs.mkdirSync(outputDir, { recursive: true });
  //         }
  //         if (!fs.existsSync(filePath)) {
  //           console.error("קובץ PDF לא נמצא:", filePath);
  //         }
          
  //         // המרת PDF לתמונה
  //         const pdfToPic = fromPath(filePath, {
  //           density: 300, // איכות התמונה
  //           saveFilename: `${Date.now()}_converted`,
  //           savePath: outputDir,
  //           format: "png", // פורמט התמונה
  //         });
  //         const conversionResult = await pdfToImage(1); // המרת העמוד הראשון בלבד
  //         console.log("PDF converted to image:", conversionResult);
  //         message.image_path = `/public/images/${conversionResult.name}`;

          
  //         // עדכון הנתיב של התמונה החדשה
  //       } else {
  //         // אם זה לא PDF, שמור את הנתיב המקורי
  //         message.image_path = `/public/images${message.image_path}`;
  //       }
  //       console.log(`after image_path`, message);
  //     }

  //     const newMessage = await createMessage(message);
  //     // שליחת אירוע ללקוח על הוספת הודעה
  //     io.emit("message_event", { event: "create", data: newMessage });

  //     res.status(201).json(newMessage);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ error: error.message });
  //   }
  // });
  // router.post(
  //   "/upload_image",
  //   upload.single("image_path"),
  //   async (req, res) => {
  //     console.log("POST /messages/upload", req.body);
  //     let filePath = `/${req.file.filename}`;

  //     res.status(201).json({ filePath });
  //   }
  // );

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Deleting message with id: ${id}`);
      await deleteMessage(id);

      // שליחת אירוע ללקוח על מחיקת הודעה
      io.emit("message_event", { event: "delete", data: { id } });

      // console.log(`Message with id: ${id} deleted successfully`);

      res.status(200).json("Message deleted successfully");

      // res.status(204).send();
    } catch (error) {
      console.log(`Error deleting message with id: ${id}`, error);

      res.status(500).json({ error: error.message });
    }
  });

  router.put("/:id", async (req, res) => {
    console.log("PUT /messages", req.body);

    try {
      const { id } = req.params;
      const message = req.body;
      const updatedMessage = await updateMessage(id, message);
      // שליחת אירוע ללקוח על עדכון הודעה
      io.emit("message_event", { event: "update", data: { id, message } });

      res.json(updatedMessage);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: error.message });
    }
  });
  return router;
};
