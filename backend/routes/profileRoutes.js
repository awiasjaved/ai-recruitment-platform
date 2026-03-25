const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ---- Job Seeker Routes ----
router.get('/seeker', protect, authorize('job_seeker'), profileController.getSeekerProfile);
router.put('/seeker', protect, authorize('job_seeker'), profileController.updateSeekerProfile);
router.post('/seeker/upload-cv', protect, authorize('job_seeker'), profileController.upload.single('cv'), profileController.uploadCV);

// ---- Job Provider Routes ----
router.get('/provider', protect, authorize('job_provider'), profileController.getProviderProfile);
router.put('/provider', protect, authorize('job_provider'), profileController.updateProviderProfile);

// ---- Public Route ----
router.get('/seeker/:id', protect, authorize('job_provider', 'admin'), profileController.getPublicSeekerProfile);

module.exports = router;