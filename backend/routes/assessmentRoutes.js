const express = require('express');
const router = express.Router();
const {
    startAssessment,
    submitAssessment,
    getMyAssessments,
    getAssessmentResult,
    getAvailableSkills
} = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Skills list - sab dekh sakte hain
router.get('/skills', getAvailableSkills);

// Sirf job_seeker ke liye
router.post('/start', protect, authorize('job_seeker'), startAssessment);
router.post('/submit/:id', protect, authorize('job_seeker'), submitAssessment);
router.get('/my', protect, authorize('job_seeker'), getMyAssessments);
router.get('/:id', protect, authorize('job_seeker'), getAssessmentResult);

module.exports = router;