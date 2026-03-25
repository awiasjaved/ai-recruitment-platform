const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ============================================
// MULTER SETUP - CV Upload ke liye
// ============================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads/cvs';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `cv_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    } else {
        cb(new Error('Sirf PDF ya Word file upload kar sakte hain'), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// ============================================
// JOB SEEKER - PROFILE DEKHNA
// GET /api/profile/seeker
// ============================================
const getSeekerProfile = async (req, res) => {
    try {
        const [profiles] = await db.query(
            `SELECT u.id as user_id, u.name, u.email, u.created_at,
             jsp.id as profile_id, jsp.skills, jsp.education, 
             jsp.experience, jsp.cv_path, jsp.bio
             FROM users u
             JOIN job_seeker_profiles jsp ON u.id = jsp.user_id
             WHERE u.id = ?`,
            [req.user.id]
        );

        if (profiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Profile nahi mili'
            });
        }

        // Assessment scores bhi lao
        const [assessments] = await db.query(
            `SELECT skill_domain, score, status, taken_at 
             FROM assessments 
             WHERE seeker_id = ? 
             ORDER BY taken_at DESC`,
            [profiles[0].profile_id]
        );

        res.status(200).json({
            success: true,
            profile: profiles[0],
            assessments
        });

    } catch (error) {
        console.error('GetSeekerProfile error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// JOB SEEKER - PROFILE UPDATE KARNA
// PUT /api/profile/seeker
// ============================================
const updateSeekerProfile = async (req, res) => {
    try {
        const { name, skills, education, experience, bio } = req.body;

        // Name update karo users table mein
        if (name) {
            await db.query(
                'UPDATE users SET name = ? WHERE id = ?',
                [name, req.user.id]
            );
        }

        // Profile update karo
        await db.query(
            `UPDATE job_seeker_profiles SET
             skills = COALESCE(?, skills),
             education = COALESCE(?, education),
             experience = COALESCE(?, experience),
             bio = COALESCE(?, bio)
             WHERE user_id = ?`,
            [skills, education, experience, bio, req.user.id]
        );

        // Updated profile wapas bhejo
        const [updated] = await db.query(
            `SELECT u.name, u.email, jsp.skills, jsp.education, 
             jsp.experience, jsp.cv_path, jsp.bio
             FROM users u
             JOIN job_seeker_profiles jsp ON u.id = jsp.user_id
             WHERE u.id = ?`,
            [req.user.id]
        );

        res.status(200).json({
            success: true,
            message: 'Profile update ho gayi!',
            profile: updated[0]
        });

    } catch (error) {
        console.error('UpdateSeekerProfile error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// JOB SEEKER - CV UPLOAD KARNA
// POST /api/profile/seeker/upload-cv
// ============================================
const uploadCV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'CV file select karo'
            });
        }

        const cvPath = `/uploads/cvs/${req.file.filename}`;

        // Purani CV delete karo agar hai
        const [profiles] = await db.query(
            'SELECT cv_path FROM job_seeker_profiles WHERE user_id = ?',
            [req.user.id]
        );

        if (profiles[0]?.cv_path) {
            const oldPath = `.${profiles[0].cv_path}`;
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Naya path save karo
        await db.query(
            'UPDATE job_seeker_profiles SET cv_path = ? WHERE user_id = ?',
            [cvPath, req.user.id]
        );

        res.status(200).json({
            success: true,
            message: 'CV upload ho gayi!',
            cv_path: cvPath
        });

    } catch (error) {
        console.error('UploadCV error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// JOB PROVIDER - PROFILE DEKHNA
// GET /api/profile/provider
// ============================================
const getProviderProfile = async (req, res) => {
    try {
        const [profiles] = await db.query(
            `SELECT u.id as user_id, u.name, u.email, u.created_at,
             jpp.id as profile_id, jpp.company_name, jpp.industry, 
             jpp.website, jpp.description
             FROM users u
             JOIN job_provider_profiles jpp ON u.id = jpp.user_id
             WHERE u.id = ?`,
            [req.user.id]
        );

        if (profiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Profile nahi mili'
            });
        }

        // Posted jobs bhi lao
        const [jobs] = await db.query(
            `SELECT id, title, status, experience_level, job_type, posted_at
             FROM jobs 
             WHERE provider_id = ?
             ORDER BY posted_at DESC`,
            [profiles[0].profile_id]
        );

        res.status(200).json({
            success: true,
            profile: profiles[0],
            jobs
        });

    } catch (error) {
        console.error('GetProviderProfile error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// JOB PROVIDER - PROFILE UPDATE KARNA
// PUT /api/profile/provider
// ============================================
const updateProviderProfile = async (req, res) => {
    try {
        const { name, company_name, industry, website, description } = req.body;

        // Name update karo
        if (name) {
            await db.query(
                'UPDATE users SET name = ? WHERE id = ?',
                [name, req.user.id]
            );
        }

        // Company profile update karo
        await db.query(
            `UPDATE job_provider_profiles SET
             company_name = COALESCE(?, company_name),
             industry = COALESCE(?, industry),
             website = COALESCE(?, website),
             description = COALESCE(?, description)
             WHERE user_id = ?`,
            [company_name, industry, website, description, req.user.id]
        );

        // Updated profile wapas bhejo
        const [updated] = await db.query(
            `SELECT u.name, u.email, jpp.company_name, jpp.industry, 
             jpp.website, jpp.description
             FROM users u
             JOIN job_provider_profiles jpp ON u.id = jpp.user_id
             WHERE u.id = ?`,
            [req.user.id]
        );

        res.status(200).json({
            success: true,
            message: 'Company profile update ho gayi!',
            profile: updated[0]
        });

    } catch (error) {
        console.error('UpdateProviderProfile error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// KISI BHI SEEKER KI PUBLIC PROFILE DEKHNA
// GET /api/profile/seeker/:id
// Provider dekh sakta hai
// ============================================
const getPublicSeekerProfile = async (req, res) => {
    try {
        const [profiles] = await db.query(
            `SELECT u.name, u.email,
             jsp.skills, jsp.education, jsp.experience, jsp.bio, jsp.cv_path
             FROM users u
             JOIN job_seeker_profiles jsp ON u.id = jsp.user_id
             WHERE u.id = ? AND u.role = 'job_seeker'`,
            [req.params.id]
        );

        if (profiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Seeker profile nahi mili'
            });
        }

        // Assessment results bhi dikhao
        const [assessments] = await db.query(
            `SELECT a.skill_domain, a.score, a.taken_at
             FROM assessments a
             JOIN job_seeker_profiles jsp ON a.seeker_id = jsp.id
             WHERE jsp.user_id = ? AND a.status = 'completed'
             ORDER BY a.score DESC`,
            [req.params.id]
        );

        res.status(200).json({
            success: true,
            profile: profiles[0],
            assessments
        });

    } catch (error) {
        console.error('GetPublicSeekerProfile error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    upload,
    getSeekerProfile,
    updateSeekerProfile,
    uploadCV,
    getProviderProfile,
    updateProviderProfile,
    getPublicSeekerProfile
};