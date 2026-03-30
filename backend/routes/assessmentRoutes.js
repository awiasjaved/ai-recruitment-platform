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

// Skills list
router.get('/skills', getAvailableSkills);

// Just for job-seekers Routes
router.post('/start', protect, authorize('job_seeker'), startAssessment);
router.post('/submit/:id', protect, authorize('job_seeker'), submitAssessment);
router.get('/my', protect, authorize('job_seeker'), getMyAssessments);
router.get('/:id', protect, authorize('job_seeker'), getAssessmentResult);

module.exports = router;