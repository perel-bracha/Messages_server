const {Router} = require('express');
const studyYearsService = require('../Services/study_years.services');
const router = Router();

router.get('/', async (req, res) => {
    
  try {
    const studyYears = await studyYearsService.getAllStudyYears();
    res.json(studyYears);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;