const express = require('express');
const router = express.Router();
const {
    createJob,
    getAllJobs,
    getJobById,
    getMyJobs,
    updateJob,
    deleteJob,
    getJobCandidates
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected - just for job_provider routes
router.post('/create', protect, authorize('job_provider'), createJob);
router.get('/provider/my-jobs', protect, authorize('job_provider'), getMyJobs);
router.put('/:id', protect, authorize('job_provider'), updateJob);
router.delete('/:id', protect, authorize('job_provider'), deleteJob);
router.get('/:id/candidates', protect, authorize('job_provider'), getJobCandidates);

module.exports = router;