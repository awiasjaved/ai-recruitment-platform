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
        'Tell us about your experience in web development. What projects have you worked on?',
        'Do you have experience working with React or any other frontend framework?',
        'Explain how you design REST APIs.',
        'What do you do for database optimization?',
        'Tell us about your experience working in a team.',
        'Tell us about a difficult bug you faced and how you solved it.',
        'What is your biggest technical achievement so far?'
    ],

    'python': [
        'Tell us about your experience with Python. What kind of projects have you worked on?',
        'How do you use Object Oriented Programming concepts in Python?',
        'Which Python libraries do you use the most?',
        'How do you optimize performance in Python?',
        'How do you test your Python projects?',
        'Describe a complex problem you solved using Python.',
        'What best practices do you follow while writing Python code?'
    ],

    'data science': [
        'Tell us about your experience in Data Science.',
        'Which Machine Learning algorithms have you used and why?',
        'Explain your data cleaning process.',
        'What metrics do you use for model evaluation?',
        'Describe a real-world data science project you have worked on.',
        'How do you handle big data?',
        'Which tools do you use for data visualization?'
    ],

    'graphic design': [
        'Tell us about your experience in graphic design.',
        'Which design tools do you use?',
        'How do you manage the design process with clients?',
        'Explain your approach to brand identity design.',
        'Tell us about a creative challenge you faced and how you solved it.',
        'How do you stay updated with current design trends?',
        'What is your knowledge of typography and color theory?'
    ],

    'mobile development': [
        'Tell us about your experience in mobile development.',
        'Do you prefer Android, iOS, or cross-platform development? Why?',
        'What do you do to optimize app performance?',
        'Explain how you implement push notifications.',
        'Do you have experience with the App Store or Play Store submission process?',
        'Tell us about a complex mobile feature you have implemented.',
        'What security practices do you follow in mobile app development?'
    ],

    'default': [
        'Tell us about your professional experience.',
        'What motivated you to enter this field?',
        'What is your strongest skill?',
        'Tell us about your experience working in a team.',
        'How do you work under pressure?',
        'Where do you see yourself in the next 5 years?',
        'Why do you want to join our company?'
    ]
};

// ============================================
// INTERVIEW Start
// POST /api/interview/start
// ============================================
const startInterview = async (req, res) => {
    try {
        const { job_id, skill_domain } = req.body;

        // Seeker profile 
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

        // Check pending interview
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

        // Select Questions
        const domain = skill_domain ? skill_domain.toLowerCase() : 'default';
        const questions = interviewQuestions[domain] || interviewQuestions['default'];

        // Interview Save in database 
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
// INTERVIEW RESPONSES SAVE
// POST /api/interview/save-response/:id
// ============================================
const saveResponse = async (req, res) => {
    try {
        const { question_index, answer } = req.body;
        const interviewId = req.params.id;

        // Interview
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

        // Answer save 
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
// VIDEO UPLOAD
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

        // Interview check
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

        // privious video delete if exist 
        if (interviews[0].video_path) {
            const oldPath = `.${interviews[0].video_path}`;
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Video path save
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
// INTERVIEW COMPLETE
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

        // send notification to provider if job_id exist
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
// BEHAVIOR LOG SAVE (Webcam monitoring)
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

        // count total flags for this behavior type in this interview
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
// Over INTERVIEWS View
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
// PROVIDER / SEEKER / ADMIN - INTERVIEW View
// GET /api/interview/view/:id
// ============================================
const viewInterview = async (req, res) => {
    try {
        const [interviews] = await db.query(
            `SELECT i.*, u.name as seeker_name, u.email as seeker_email,
             jsp.user_id as seeker_user_id, jsp.skills, jsp.education, jsp.experience,
             j.title as job_title, jpp.user_id as provider_user_id, jpp.company_name
             FROM interviews i
             JOIN job_seeker_profiles jsp ON i.seeker_id = jsp.id
             JOIN users u ON jsp.user_id = u.id
             LEFT JOIN jobs j ON i.job_id = j.id
             LEFT JOIN job_provider_profiles jpp ON j.provider_id = jpp.id
             WHERE i.id = ?`,
            [req.params.id]
        );

        if (interviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Interview nahi mili'
            });
        }

        const interview = interviews[0];
        const isAdmin = req.user.role === 'admin';
        const isOwnerSeeker = req.user.role === 'job_seeker' && interview.seeker_user_id === req.user.id;
        const isOwnerProvider = req.user.role === 'job_provider' && interview.provider_user_id === req.user.id;

        if (!isAdmin && !isOwnerSeeker && !isOwnerProvider) {
            return res.status(403).json({
                success: false,
                message: 'Aap is interview ko view nahi kar sakte'
            });
        }

        // Behavior logs
        const [behaviorLogs] = await db.query(
            `SELECT behavior_type, COUNT(*) as count
             FROM behavior_logs
             WHERE interview_id = ?
             GROUP BY behavior_type`,
            [req.params.id]
        );

        let parsedResponses = null;
        if (interview.responses) {
            try {
                parsedResponses = JSON.parse(interview.responses);
            } catch (parseError) {
                parsedResponses = interview.responses;
            }
        }

        const { seeker_user_id, provider_user_id, ...safeInterview } = interview;

        res.status(200).json({
            success: true,
            interview: {
                ...safeInterview,
                responses: parsedResponses
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