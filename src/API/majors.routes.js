const { Router } = require("express");
const majorsService = require("../Services/majors.services");
const { getMessagesByMajor, getMessagesRelevantByMajor } = require("../Services/messages.services");
const router = Router();

router.get("/", async (req, res) => {
  console.log("majors route");
  try {
    const majors = await majorsService.getAllMajors();
    res.json(majors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const major = await majorsService.getMajorById(id);
    if (!major) {
      return res.status(404).json({ error: "Major not found" });
    }
    res.json(major);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(`/:id/messages`, async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await getMessagesByMajor(id);
    if (!messages) {
      return res.status(404).json({ error: "Messages not found" });
    }
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/:id/messages/relevant', async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await getMessagesRelevantByMajor(id);
    if (!messages) {
      return res.status(404).json({ error: "Messages not found" });
    }
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/screen/:screenNum', async (req, res) => {
  try {
    const { screenNum } = req.params;
    const majors = await majorsService.getScreenMajors(screenNum);
    if (!majors) {
      return res.status(404).json({ error: "Majors not found" });
    }
    res.json(majors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const newMajor = await majorsService.createMajor(name);
    res.status(201).json(newMajor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
