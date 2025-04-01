const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const backgroundService = require("../Services/backgrounds.services");

const router = Router();


router.get("/", async (req, res) => {
  console.log("backgrounds route");
  
  try {
    const backgrounds = await backgroundService.getAllBackgrounds();
    res.json(backgrounds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
