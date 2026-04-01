const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes in this file are protected and only accessible by admin users
router.use(protect, authorize('admin'));

// ============================================
// All Users View (Admin)
// GET /api/admin/users
// ============================================
router.get('/users', async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT u.id, u.name, u.email, u.role, u.is_active, u.created_at,
             (SELECT COUNT(*) FROM assessments a JOIN job_seeker_profiles jsp ON a.seeker_id = jsp.id WHERE jsp.user_id = u.id) as assessment_count,
             (SELECT COUNT(*) FROM interviews i JOIN job_seeker_profiles jsp ON i.seeker_id = jsp.id WHERE jsp.user_id = u.id) as interview_count
             FROM users u
             ORDER BY u.created_at DESC`
        );
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// USER BAN / UNBAN (Admin)
// PUT /api/admin/users/:id/toggle
// ============================================
router.put('/users/:id/toggle', async (req, res) => {
    try {
        const [users] = await db.query('SELECT is_active FROM users WHERE id = ?', [req.params.id]);
        if (users.length === 0) return res.status(404).json({ success: false, message: 'User nahi mila' });

        const newStatus = !users[0].is_active;
        await db.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, req.params.id]);

        res.json({ success: true, message: newStatus ? 'User active ho gaya' : 'User ban ho gaya' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// All JOBS view (Admin)
// GET /api/admin/jobs
// ============================================
router.get('/jobs', async (req, res) => {
    try {
        const [jobs] = await db.query(
            `SELECT j.*, jpp.company_name, u.name as provider_name
             FROM jobs j
             JOIN job_provider_profiles jpp ON j.provider_id = jpp.id
             JOIN users u ON jpp.user_id = u.id
             ORDER BY j.posted_at DESC`
        );
        res.json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// JOB DELETE (Admin)
// DELETE /api/admin/jobs/:id
// ============================================
router.delete('/jobs/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Job delete ho gayi' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;