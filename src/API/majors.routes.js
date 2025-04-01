const {Router} = require('express');
const majorsService = require('../Services/majors.services');
const router = Router();

router.get('/', async (req, res) => {
    console.log("majors route");
    
  try {
    const majors = await majorsService.getAllMajors();
    res.json(majors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;