const db = require('../config/db');

// ============================================
// JOB POST
// POST /api/jobs/create
// just job_provider
// ============================================
const createJob = async (req, res) => {
    try {
        const { title, description, required_skills, experience_level, job_type } = req.body;

        // Validation
        if (!title || !description || !required_skills) {
            return res.status(400).json({
                success: false,
                message: 'Title, description aur required_skills zaroori hain'
            });
        }

        // Provider profile view
        const [profiles] = await db.query(
            'SELECT id FROM job_provider_profiles WHERE user_id = ?',
            [req.user.id]
        );

        if (profiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job provider profile nahi mila'
            });
        }

        const providerId = profiles[0].id;

        // job save in database
        const [result] = await db.query(
            `INSERT INTO jobs (provider_id, title, description, required_skills, experience_level, job_type) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                providerId,
                title,
                description,
                required_skills,
                experience_level || 'entry',
                job_type || 'full_time'
            ]
        );

        // Send notification to matching seekers
        const skillsList = required_skills.split(',').map(s => s.trim());

        for (const skill of skillsList) {
            const [seekers] = await db.query(
                `SELECT u.id FROM users u
                 JOIN job_seeker_profiles jsp ON u.id = jsp.user_id
                 WHERE jsp.skills LIKE ? AND u.role = 'job_seeker'`,
                [`%${skill}%`]
            );

            for (const seeker of seekers) {
                await db.query(
                    `INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)`,
                    [
                        seeker.id,
                        `New Job Available: ${title}`,
                        'job_match'
                    ]
                );
            }
        }

        res.status(201).json({
            success: true,
            message: 'Job post ho gayi!',
            jobId: result.insertId
        });

    } catch (error) {
        console.error('CreateJob error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// All JOBS View
// GET /api/jobs
// All users View
// ============================================
const getAllJobs = async (req, res) => {
    try {
        const { skill, experience_level, job_type, search } = req.query;

        let query = `
            SELECT j.*, jpp.company_name, jpp.industry, u.name as provider_name
            FROM jobs j
            JOIN job_provider_profiles jpp ON j.provider_id = jpp.id
            JOIN users u ON jpp.user_id = u.id
            WHERE j.status = 'active'
        `;

        const params = [];

        // Filters
        if (skill) {
            query += ` AND j.required_skills LIKE ?`;
            params.push(`%${skill}%`);
        }

        if (experience_level) {
            query += ` AND j.experience_level = ?`;
            params.push(experience_level);
        }

        if (job_type) {
            query += ` AND j.job_type = ?`;
            params.push(job_type);
        }

        if (search) {
            query += ` AND (j.title LIKE ? OR j.description LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY j.posted_at DESC`;

        const [jobs] = await db.query(query, params);

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error('GetAllJobs error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// once JOB View
// GET /api/jobs/:id
// ============================================
const getJobById = async (req, res) => {
    try {
        const [jobs] = await db.query(
            `SELECT j.*, jpp.company_name, jpp.industry, jpp.website, jpp.description as company_desc, u.name as provider_name
             FROM jobs j
             JOIN job_provider_profiles jpp ON j.provider_id = jpp.id
             JOIN users u ON jpp.user_id = u.id
             WHERE j.id = ?`,
            [req.params.id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job nahi mili'
            });
        }

        res.status(200).json({
            success: true,
            job: jobs[0]
        });

    } catch (error) {
        console.error('GetJobById error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// Over JOBS View (Provider)
// GET /api/jobs/my-jobs
// ============================================
const getMyJobs = async (req, res) => {
    try {
        const [profiles] = await db.query(
            'SELECT id FROM job_provider_profiles WHERE user_id = ?',
            [req.user.id]
        );

        if (profiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Provider profile nahi mila'
            });
        }

        const [jobs] = await db.query(
            `SELECT j.*, 
             (SELECT COUNT(*) FROM interviews i 
              JOIN job_seeker_profiles jsp ON i.seeker_id = jsp.id 
              WHERE i.job_id = j.id) as total_applicants
             FROM jobs j
             WHERE j.provider_id = ?
             ORDER BY j.posted_at DESC`,
            [profiles[0].id]
        );

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error('GetMyJobs error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// JOB UPDATE
// PUT /api/jobs/:id
// ============================================
const updateJob = async (req, res) => {
    try {
        const { title, description, required_skills, experience_level, job_type, status } = req.body;

        // check this job is provider's job
        const [jobs] = await db.query(
            `SELECT j.* FROM jobs j
             JOIN job_provider_profiles jpp ON j.provider_id = jpp.id
             WHERE j.id = ? AND jpp.user_id = ?`,
            [req.params.id, req.user.id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job nahi mili ya tumhari permission nahi'
            });
        }

        await db.query(
            `UPDATE jobs SET 
             title = COALESCE(?, title),
             description = COALESCE(?, description),
             required_skills = COALESCE(?, required_skills),
             experience_level = COALESCE(?, experience_level),
             job_type = COALESCE(?, job_type),
             status = COALESCE(?, status)
             WHERE id = ?`,
            [title, description, required_skills, experience_level, job_type, status, req.params.id]
        );

        res.status(200).json({
            success: true,
            message: 'Job update ho gayi!'
        });

    } catch (error) {
        console.error('UpdateJob error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// JOB DELETE
// DELETE /api/jobs/:id
// ============================================
const deleteJob = async (req, res) => {
    try {
        const [jobs] = await db.query(
            `SELECT j.* FROM jobs j
             JOIN job_provider_profiles jpp ON j.provider_id = jpp.id
             WHERE j.id = ? AND jpp.user_id = ?`,
            [req.params.id, req.user.id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job nahi mili ya tumhari permission nahi'
            });
        }

        await db.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);

        res.status(200).json({
            success: true,
            message: 'Job delete ho gayi!'
        });

    } catch (error) {
        console.error('DeleteJob error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// JOB CANDIDATES check  (Provider)
// GET /api/jobs/:id/candidates
// ============================================
const getJobCandidates = async (req, res) => {
    try {
        // check this job is provider's job
        const [jobs] = await db.query(
            `SELECT j.* FROM jobs j
             JOIN job_provider_profiles jpp ON j.provider_id = jpp.id
             WHERE j.id = ? AND jpp.user_id = ?`,
            [req.params.id, req.user.id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job nahi mili ya tumhari permission nahi'
            });
        }

        // Get candidates with interview and assessment details
        const [candidates] = await db.query(
            `SELECT 
                u.id, u.name, u.email,
                jsp.skills, jsp.education, jsp.experience, jsp.cv_path,
                i.video_path, i.conducted_at, i.status as interview_status,
                a.score as assessment_score, a.skill_domain
             FROM interviews i
             JOIN job_seeker_profiles jsp ON i.seeker_id = jsp.id
             JOIN users u ON jsp.user_id = u.id
             LEFT JOIN assessments a ON a.seeker_id = jsp.id
             WHERE i.job_id = ?
             ORDER BY a.score DESC`,
            [req.params.id]
        );

        res.status(200).json({
            success: true,
            count: candidates.length,
            candidates
        });

    } catch (error) {
        console.error('GetJobCandidates error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    getMyJobs,
    updateJob,
    deleteJob,
    getJobCandidates
};