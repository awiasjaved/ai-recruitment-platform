const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ============================================
// MULTER SETUP - Video Upload ke liye
// ============================================
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads/interviews';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `interview_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const videoFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Sirf video file upload kar sakte hain'), false);
    }
};

const uploadVideo = multer({
    storage: videoStorage,
    fileFilter: videoFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB max
});

// ============================================
// INTERVIEW QUESTION BANK
// ============================================
const interviewQuestions = {
    'web development': [
        'Apna web development ka experience batao. Kaunse projects kiye hain?',
        'React ya any frontend framework mein kaam karne ka experience hai?',
        'REST API design karne ka tariqa batao.',
        'Database optimization ke liye kya karte ho?',
        'Team mein kaam karne ka experience batao.',
        'Koi mushkil bug tha jo tumne solve kiya? Batao kaise kiya.',
        'Apni sabse bari technical achievement kya hai?'
    ],
    'python': [
        'Python mein apna experience batao. Kaunse projects kiye?',
        'Object Oriented Programming Python mein kaise use karte ho?',
        'Python libraries jo zyada use karti ho batao.',
        'Performance optimization Python mein kaise karte ho?',
        'Testing Python projects mein kaise karte ho?',
        'Koi complex problem thi jo Python se solve ki? Batao.',
        'Python mein best practices kya follow karte ho?'
    ],
    'data science': [
        'Data science mein apna experience batao.',
        'Kaunse ML algorithms use kiye hain aur kyun?',
        'Data cleaning process explain karo.',
        'Model evaluation ke liye kya metrics use karte ho?',
        'Koi real world data science project explain karo.',
        'Big data ke saath kaise deal karte ho?',
        'Data visualization ke liye kaunse tools use karte ho?'
    ],
    'graphic design': [
        'Graphic design mein apna experience batao.',
        'Kaunse design tools use karte ho?',
        'Client ke saath design process kaise manage karte ho?',
        'Brand identity design karne ka tariqa batao.',
        'Koi creative challenge tha? Kaise solve kiya?',
        'Design trends ke saath update kaise rehte ho?',
        'Typography aur color theory ka knowledge batao.'
    ],
    'mobile development': [
        'Mobile development mein apna experience batao.',
        'Android ya iOS ya cross platform - kya prefer karte ho aur kyun?',
        'App performance optimize karne ke liye kya karte ho?',
        'Push notifications implement karne ka tariqa batao.',
        'App store submission process experience hai?',
        'Koi complex mobile feature implement ki? Batao.',
        'Mobile security ke liye kya practices follow karte ho?'
    ],
    'default': [
        'Apna professional experience batao.',
        'Is field mein aane ki motivation kya thi?',
        'Apni strongest skill kya hai?',
        'Team mein kaam karne ka experience batao.',
        'Pressure mein kaise kaam karte ho?',
        'Aglay 5 salon mein khud ko kahan dekhte ho?',
        'Hamari company mein kyun join karna chahte ho?'
    ]
};

// ============================================
// INTERVIEW SHURU KARNA
// POST /api/interview/start
// ============================================
const startInterview = async (req, res) => {
    try {
        const { job_id, skill_domain } = req.body;

        // Seeker profile lao
        const [profiles] = await db.query(
            'SELECT id FROM job_seeker_profiles WHERE user_id = ?',
            [req.user.id]
        );

        if (profiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job seeker profile nahi mili'
            });
        }

        const seekerId = profiles[0].id;

        // Pehle se pending interview check karo
        const [pending] = await db.query(
            `SELECT id FROM interviews 
             WHERE seeker_id = ? AND status = 'pending'`,
            [seekerId]
        );

        if (pending.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Pehle se ek interview pending hai',
                interview_id: pending[0].id
            });
        }

        // Questions select karo
        const domain = skill_domain ? skill_domain.toLowerCase() : 'default';
        const questions = interviewQuestions[domain] || interviewQuestions['default'];

        // Interview database mein save karo
        const [result] = await db.query(
            `INSERT INTO interviews (seeker_id, job_id, responses, status) 
             VALUES (?, ?, ?, 'pending')`,
            [seekerId, job_id || null, JSON.stringify({ questions, answers: [] })]
        );

        res.status(201).json({
            success: true,
            message: 'Interview shuru ho gayi! Webcam allow karo.',
            interview_id: result.insertId,
            instructions: [
                'Webcam aur microphone allow karo',
                'Shant jagah par baitho',
                'Saaf awaaz mein jawab do',
                'Seedha camera ki taraf dekho',
                'Har sawaal ka jawab 1-2 minute mein do'
            ],
            questions
        });

    } catch (error) {
        console.error('StartInterview error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// INTERVIEW RESPONSES SAVE KARNA
// POST /api/interview/save-response/:id
// ============================================
const saveResponse = async (req, res) => {
    try {
        const { question_index, answer } = req.body;
        const interviewId = req.params.id;

        // Interview lao
        const [interviews] = await db.query(
            `SELECT i.* FROM interviews i
             JOIN job_seeker_profiles jsp ON i.seeker_id = jsp.id
             WHERE i.id = ? AND jsp.user_id = ?`,
            [interviewId, req.user.id]
        );

        if (interviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Interview nahi mili'
            });
        }

        const interview = interviews[0];
        const responses = JSON.parse(interview.responses);

        // Answer save karo
        if (!responses.answers) responses.answers = [];
        responses.answers[question_index] = {
            question: responses.questions[question_index],
            answer,
            timestamp: new Date()
        };

        await db.query(
            'UPDATE interviews SET responses = ? WHERE id = ?',
            [JSON.stringify(responses), interviewId]
        );

        res.status(200).json({
            success: true,
            message: 'Response save ho gaya',
            next_question: question_index + 1 < responses.questions.length
                ? responses.questions[question_index + 1]
                : null
        });

    } catch (error) {
        console.error('SaveResponse error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// VIDEO UPLOAD KARNA
// POST /api/interview/upload-video/:id
// ============================================
const uploadInterviewVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Video file select karo'
            });
        }

        const interviewId = req.params.id;
        const videoPath = `/uploads/interviews/${req.file.filename}`;

        // Interview check karo
        const [interviews] = await db.query(
            `SELECT i.* FROM interviews i
             JOIN job_seeker_profiles jsp ON i.seeker_id = jsp.id
             WHERE i.id = ? AND jsp.user_id = ?`,
            [interviewId, req.user.id]
        );

        if (interviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Interview nahi mili'
            });
        }

        // Purani video delete karo agar hai
        if (interviews[0].video_path) {
            const oldPath = `.${interviews[0].video_path}`;
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Video path save karo
        await db.query(
            'UPDATE interviews SET video_path = ? WHERE id = ?',
            [videoPath, interviewId]
        );

        res.status(200).json({
            success: true,
            message: 'Video upload ho gayi!',
            video_path: videoPath
        });

    } catch (error) {
        console.error('UploadInterviewVideo error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// INTERVIEW COMPLETE KARNA
// PUT /api/interview/complete/:id
// ============================================
const completeInterview = async (req, res) => {
    try {
        const interviewId = req.params.id;

        const [interviews] = await db.query(
            `SELECT i.* FROM interviews i
             JOIN job_seeker_profiles jsp ON i.seeker_id = jsp.id
             WHERE i.id = ? AND jsp.user_id = ?`,
            [interviewId, req.user.id]
        );

        if (interviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Interview nahi mili'
            });
        }

        await db.query(
            `UPDATE interviews SET status = 'completed' WHERE id = ?`,
            [interviewId]
        );

        // Provider ko notification bhejo agar job linked hai
        if (interviews[0].job_id) {
            const [jobs] = await db.query(
                `SELECT j.*, jpp.user_id as provider_user_id, u.name as seeker_name
                 FROM jobs j
                 JOIN job_provider_profiles jpp ON j.provider_id = jpp.id
                 JOIN interviews i ON i.job_id = j.id
                 JOIN job_seeker_profiles jsp ON i.seeker_id = jsp.id
                 JOIN users u ON jsp.user_id = u.id
                 WHERE j.id = ? AND i.id = ?`,
                [interviews[0].job_id, interviewId]
            );

            if (jobs.length > 0) {
                await db.query(
                    `INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)`,
                    [
                        jobs[0].provider_user_id,
                        `${jobs[0].seeker_name} ne tumhari job "${jobs[0].title}" ke liye interview complete kar li!`,
                        'candidate_match'
                    ]
                );
            }
        }

        res.status(200).json({
            success: true,
            message: 'Interview complete ho gayi! HR jald hi review karega.'
        });

    } catch (error) {
        console.error('CompleteInterview error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// BEHAVIOR LOG SAVE KARNA (Webcam monitoring)
// POST /api/interview/behavior/:id
// ============================================
const saveBehaviorLog = async (req, res) => {
    try {
        const { behavior_type } = req.body;
        const interviewId = req.params.id;

        const validBehaviors = ['looking_away', 'multiple_faces', 'excessive_movement'];

        if (!validBehaviors.includes(behavior_type)) {
            return res.status(400).json({
                success: false,
                message: 'Behavior type galat hai'
            });
        }

        await db.query(
            `INSERT INTO behavior_logs (interview_id, behavior_type) VALUES (?, ?)`,
            [interviewId, behavior_type]
        );

        // Count karo kitni baar yeh behavior hua
        const [count] = await db.query(
            `SELECT COUNT(*) as total FROM behavior_logs 
             WHERE interview_id = ? AND behavior_type = ?`,
            [interviewId, behavior_type]
        );

        res.status(201).json({
            success: true,
            message: 'Behavior logged',
            total_flags: count[0].total
        });

    } catch (error) {
        console.error('SaveBehaviorLog error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// APNI INTERVIEWS DEKHNA
// GET /api/interview/my
// ============================================
const getMyInterviews = async (req, res) => {
    try {
        const [profiles] = await db.query(
            'SELECT id FROM job_seeker_profiles WHERE user_id = ?',
            [req.user.id]
        );

        if (profiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Profile nahi mili'
            });
        }

        const [interviews] = await db.query(
            `SELECT i.id, i.status, i.video_path, i.conducted_at,
             j.title as job_title, jpp.company_name
             FROM interviews i
             LEFT JOIN jobs j ON i.job_id = j.id
             LEFT JOIN job_provider_profiles jpp ON j.provider_id = jpp.id
             WHERE i.seeker_id = ?
             ORDER BY i.conducted_at DESC`,
            [profiles[0].id]
        );

        res.status(200).json({
            success: true,
            count: interviews.length,
            interviews
        });

    } catch (error) {
        console.error('GetMyInterviews error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// PROVIDER - CANDIDATE KI INTERVIEW DEKHNA
// GET /api/interview/view/:id
// ============================================
const viewInterview = async (req, res) => {
    try {
        const [interviews] = await db.query(
            `SELECT i.*, u.name as seeker_name, u.email as seeker_email,
             jsp.skills, jsp.education, jsp.experience,
             j.title as job_title
             FROM interviews i
             JOIN job_seeker_profiles jsp ON i.seeker_id = jsp.id
             JOIN users u ON jsp.user_id = u.id
             LEFT JOIN jobs j ON i.job_id = j.id
             WHERE i.id = ?`,
            [req.params.id]
        );

        if (interviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Interview nahi mili'
            });
        }

        // Behavior logs bhi lao
        const [behaviorLogs] = await db.query(
            `SELECT behavior_type, COUNT(*) as count
             FROM behavior_logs
             WHERE interview_id = ?
             GROUP BY behavior_type`,
            [req.params.id]
        );

        const interview = interviews[0];

        res.status(200).json({
            success: true,
            interview: {
                ...interview,
                responses: interview.responses ? JSON.parse(interview.responses) : null
            },
            behavior_summary: behaviorLogs
        });

    } catch (error) {
        console.error('ViewInterview error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    uploadVideo,
    startInterview,
    saveResponse,
    uploadInterviewVideo,
    completeInterview,
    saveBehaviorLog,
    getMyInterviews,
    viewInterview
};