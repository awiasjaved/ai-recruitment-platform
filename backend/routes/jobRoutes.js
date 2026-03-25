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

// Public routes - koi bhi dekh sakta hai
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected - sirf job_provider
router.post('/create', protect, authorize('job_provider'), createJob);
router.get('/provider/my-jobs', protect, authorize('job_provider'), getMyJobs);
router.put('/:id', protect, authorize('job_provider'), updateJob);
router.delete('/:id', protect, authorize('job_provider'), deleteJob);
router.get('/:id/candidates', protect, authorize('job_provider'), getJobCandidates);

module.exports = router;