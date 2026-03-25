const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Job Seeker routes
router.post('/start', protect, authorize('job_seeker'), interviewController.startInterview);
router.post('/save-response/:id', protect, authorize('job_seeker'), interviewController.saveResponse);
router.post('/upload-video/:id', protect, authorize('job_seeker'), interviewController.uploadVideo.single('video'), interviewController.uploadInterviewVideo);
router.put('/complete/:id', protect, authorize('job_seeker'), interviewController.completeInterview);
router.post('/behavior/:id', protect, authorize('job_seeker'), interviewController.saveBehaviorLog);
router.get('/my', protect, authorize('job_seeker'), interviewController.getMyInterviews);

// Job Provider routes
router.get('/view/:id', protect, authorize('job_provider', 'admin'), interviewController.viewInterview);

module.exports = router;