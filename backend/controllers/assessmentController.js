const db = require('../config/db');

// ============================================
// QUESTION BANK - Har skill ke liye questions
// ============================================
const questionBank = {
    'web development': [
        { question: 'HTML mein semantic tags ka kya faida hai?', type: 'subjective', marks: 5 },
        { question: 'CSS Flexbox aur Grid mein kya farq hai?', type: 'subjective', marks: 5 },
        { question: 'JavaScript mein "==" aur "===" mein kya farq hai?', type: 'mcq', options: ['Koi farq nahi', 'Type check karta hai ===', '== strict hai', 'Dono same hain'], answer: 1, marks: 2 },
        { question: 'REST API mein HTTP methods kaun kaun se hain?', type: 'subjective', marks: 5 },
        { question: 'Node.js mein async/await ka kya kaam hai?', type: 'subjective', marks: 5 },
        { question: 'React mein useState hook kis kaam aata hai?', type: 'mcq', options: ['Styling ke liye', 'State manage karne ke liye', 'API call ke liye', 'Routing ke liye'], answer: 1, marks: 2 },
        { question: 'CSS mein responsive design ke liye kya use karte hain?', type: 'mcq', options: ['Media Queries', 'Float', 'Position', 'Display'], answer: 0, marks: 2 },
        { question: 'JavaScript mein Promise ka kya matlab hai?', type: 'subjective', marks: 5 },
        { question: 'SQL aur NoSQL database mein kya farq hai?', type: 'subjective', marks: 5 },
        { question: 'HTTP status code 404 ka matlab kya hai?', type: 'mcq', options: ['Server error', 'Page not found', 'Unauthorized', 'Success'], answer: 1, marks: 2 },
    ],
    'python': [
        { question: 'Python mein list aur tuple mein kya farq hai?', type: 'subjective', marks: 5 },
        { question: 'Python mein decorator ka kya kaam hai?', type: 'subjective', marks: 5 },
        { question: 'Python mein GIL (Global Interpreter Lock) kya hota hai?', type: 'subjective', marks: 5 },
        { question: 'Python mein __init__ method ka kya kaam hai?', type: 'mcq', options: ['Class delete karta hai', 'Class initialize karta hai', 'Class copy karta hai', 'Kuch nahi karta'], answer: 1, marks: 2 },
        { question: 'Python mein list comprehension ka example likho', type: 'subjective', marks: 5 },
        { question: 'pip ka kya kaam hai Python mein?', type: 'mcq', options: ['Code run karna', 'Packages install karna', 'Files delete karna', 'Server chalana'], answer: 1, marks: 2 },
        { question: 'Python mein exception handling kaise karte hain?', type: 'subjective', marks: 5 },
        { question: 'Python mein lambda function kya hoti hai?', type: 'subjective', marks: 5 },
        { question: 'Django aur Flask mein kya farq hai?', type: 'subjective', marks: 5 },
        { question: 'Python mein range() function ka kya kaam hai?', type: 'mcq', options: ['Random number deta hai', 'Number sequence banata hai', 'String banata hai', 'Loop rokta hai'], answer: 1, marks: 2 },
    ],
    'data science': [
        { question: 'Machine Learning mein overfitting kya hoti hai?', type: 'subjective', marks: 5 },
        { question: 'Pandas library kis kaam aati hai?', type: 'mcq', options: ['Web development', 'Data manipulation', 'Game development', 'Mobile apps'], answer: 1, marks: 2 },
        { question: 'Supervised aur Unsupervised learning mein kya farq hai?', type: 'subjective', marks: 5 },
        { question: 'Neural Network mein activation function ka kya kaam hai?', type: 'subjective', marks: 5 },
        { question: 'Data cleaning mein null values ko kaise handle karte hain?', type: 'subjective', marks: 5 },
        { question: 'Matplotlib kis kaam aata hai?', type: 'mcq', options: ['Database management', 'Data visualization', 'Web scraping', 'File handling'], answer: 1, marks: 2 },
        { question: 'Confusion matrix kya hoti hai?', type: 'subjective', marks: 5 },
        { question: 'Random Forest algorithm kya hai?', type: 'subjective', marks: 5 },
        { question: 'Feature scaling kyun zaroori hai?', type: 'subjective', marks: 5 },
        { question: 'Train/Test split ka kya matlab hai?', type: 'mcq', options: ['Data delete karna', 'Model training aur testing ke liye data alag karna', 'Data duplicate karna', 'Data sort karna'], answer: 1, marks: 2 },
    ],
    'graphic design': [
        { question: 'RGB aur CMYK color models mein kya farq hai?', type: 'subjective', marks: 5 },
        { question: 'Vector aur Raster graphics mein kya farq hai?', type: 'subjective', marks: 5 },
        { question: 'Adobe Photoshop kis kaam aata hai?', type: 'mcq', options: ['Video editing', 'Image editing', 'Audio editing', '3D modeling'], answer: 1, marks: 2 },
        { question: 'Typography mein serif aur sans-serif fonts mein kya farq hai?', type: 'subjective', marks: 5 },
        { question: 'Logo design mein kaunse principles follow karte hain?', type: 'subjective', marks: 5 },
        { question: 'DPI ka matlab kya hai?', type: 'mcq', options: ['Dots Per Inch', 'Design Per Image', 'Digital Print Index', 'Dots Per Icon'], answer: 0, marks: 2 },
        { question: 'Color psychology design mein kyun important hai?', type: 'subjective', marks: 5 },
        { question: 'UI aur UX design mein kya farq hai?', type: 'subjective', marks: 5 },
        { question: 'Adobe Illustrator kis cheez ke liye use hota hai?', type: 'mcq', options: ['Photo editing', 'Vector graphics banana', 'Video editing', 'Audio mixing'], answer: 1, marks: 2 },
        { question: 'White space design mein kyun important hai?', type: 'subjective', marks: 5 },
    ],
    'mobile development': [
        { question: 'Android aur iOS development mein kya farq hai?', type: 'subjective', marks: 5 },
        { question: 'React Native kya hai?', type: 'mcq', options: ['Web framework', 'Cross-platform mobile framework', 'Database', 'Testing tool'], answer: 1, marks: 2 },
        { question: 'Flutter mein widget ka kya matlab hai?', type: 'subjective', marks: 5 },
        { question: 'Mobile app mein API integration kaise karte hain?', type: 'subjective', marks: 5 },
        { question: 'APK kya hota hai?', type: 'mcq', options: ['iOS file format', 'Android package file', 'Database file', 'Image file'], answer: 1, marks: 2 },
        { question: 'Push notifications kaise kaam karti hain?', type: 'subjective', marks: 5 },
        { question: 'Mobile app mein offline functionality kaise add karte hain?', type: 'subjective', marks: 5 },
        { question: 'App Store aur Play Store mein app publish karne ke steps kya hain?', type: 'subjective', marks: 5 },
        { question: 'Dart language kis framework ke saath use hoti hai?', type: 'mcq', options: ['React Native', 'Flutter', 'Xamarin', 'Ionic'], answer: 1, marks: 2 },
        { question: 'Mobile app testing ke liye kaunse tools use karte hain?', type: 'subjective', marks: 5 },
    ],
    'default': [
        { question: 'Apni field mein 5 saal baad khud ko kahan dekhte ho?', type: 'subjective', marks: 5 },
        { question: 'Team mein kaam karne ka tajurba batao', type: 'subjective', marks: 5 },
        { question: 'Apni sabse badi professional achievement kya hai?', type: 'subjective', marks: 5 },
        { question: 'Problem solving ke liye tumhara approach kya hai?', type: 'subjective', marks: 5 },
        { question: 'Nai cheezein seekhne ke liye tum kya karte ho?', type: 'subjective', marks: 5 },
        { question: 'Deadline miss hone par kya karte ho?', type: 'mcq', options: ['Ignore kar dete ho', 'Manager ko immediately batate ho', 'Kuch nahi karte', 'Dusron ko blame karte ho'], answer: 1, marks: 2 },
        { question: 'Remote work ke liye tum kitne comfortable ho?', type: 'mcq', options: ['Bilkul nahi', 'Thoda', 'Zyada', 'Poori tarah'], answer: 3, marks: 2 },
        { question: 'Apni communication skills ke baare mein batao', type: 'subjective', marks: 5 },
        { question: 'Kisi mushkil coworker ke saath kaise deal karte ho?', type: 'subjective', marks: 5 },
        { question: 'Multiple projects ek saath handle karne ka experience hai?', type: 'mcq', options: ['Nahi', 'Thoda', 'Haan', 'Bohat zyada'], answer: 2, marks: 2 },
    ]
};

// ============================================
// HELPER - Random questions select karna
// ============================================
const getRandomQuestions = (skill, count = 7) => {
    const skillLower = skill.toLowerCase();
    let questions = questionBank[skillLower] || questionBank['default'];

    // Shuffle karo
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

// ============================================
// ASSESSMENT SHURU KARNA
// POST /api/assessment/start
// ============================================
const startAssessment = async (req, res) => {
    try {
        const { skill_domain } = req.body;

        if (!skill_domain) {
            return res.status(400).json({
                success: false,
                message: 'Skill domain batao'
            });
        }

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

        // Check karo koi pending assessment toh nahi
        const [pending] = await db.query(
            `SELECT id FROM assessments 
             WHERE seeker_id = ? AND skill_domain = ? AND status = 'pending'`,
            [seekerId, skill_domain]
        );

        if (pending.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Pehle se ek assessment pending hai is skill ka',
                assessment_id: pending[0].id
            });
        }

        // Random questions generate karo
        const questions = getRandomQuestions(skill_domain);

        // Questions se answers field hata do (security)
        const questionsForClient = questions.map((q, index) => ({
            id: index + 1,
            question: q.question,
            type: q.type,
            marks: q.marks,
            options: q.options || null
        }));

        // Assessment database mein save karo
        const [result] = await db.query(
            `INSERT INTO assessments (seeker_id, skill_domain, questions, status) 
             VALUES (?, ?, ?, 'pending')`,
            [seekerId, skill_domain, JSON.stringify(questions)]
        );

        res.status(201).json({
            success: true,
            message: 'Assessment shuru ho gayi! 30 minute mein complete karo.',
            assessment_id: result.insertId,
            skill_domain,
            total_questions: questionsForClient.length,
            questions: questionsForClient
        });

    } catch (error) {
        console.error('StartAssessment error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// ASSESSMENT SUBMIT KARNA
// POST /api/assessment/submit/:id
// ============================================
const submitAssessment = async (req, res) => {
    try {
        const { answers } = req.body;
        const assessmentId = req.params.id;

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: 'Answers array bhejo'
            });
        }

        // Assessment lao
        const [assessments] = await db.query(
            `SELECT a.*, jsp.user_id FROM assessments a
             JOIN job_seeker_profiles jsp ON a.seeker_id = jsp.id
             WHERE a.id = ? AND jsp.user_id = ?`,
            [assessmentId, req.user.id]
        );

        if (assessments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Assessment nahi mili'
            });
        }

        const assessment = assessments[0];

        if (assessment.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Yeh assessment pehle hi complete ho chuki hai'
            });
        }

        // Questions parse karo
        const questions = JSON.parse(assessment.questions);

        // Score calculate karo
        let totalScore = 0;
        let maxScore = 0;
        const gradedAnswers = [];

        questions.forEach((question, index) => {
            maxScore += question.marks;
            const userAnswer = answers[index];

            if (question.type === 'mcq') {
                // MCQ auto check
                const isCorrect = parseInt(userAnswer) === question.answer;
                if (isCorrect) totalScore += question.marks;

                gradedAnswers.push({
                    question: question.question,
                    user_answer: userAnswer,
                    correct_answer: question.answer,
                    is_correct: isCorrect,
                    marks_obtained: isCorrect ? question.marks : 0
                });
            } else {
                // Subjective - partial marks do agar answer likha hai
                const hasAnswer = userAnswer && userAnswer.toString().trim().length > 10;
                const subjectiveMarks = hasAnswer ? Math.floor(question.marks * 0.6) : 0;
                totalScore += subjectiveMarks;

                gradedAnswers.push({
                    question: question.question,
                    user_answer: userAnswer,
                    marks_obtained: subjectiveMarks,
                    note: 'Subjective answer - partial marks diye gaye'
                });
            }
        });

        // Percentage nikalo
        const percentage = Math.round((totalScore / maxScore) * 100);

        // Assessment update karo
        await db.query(
            `UPDATE assessments SET 
             answers = ?, score = ?, status = 'completed'
             WHERE id = ?`,
            [JSON.stringify(gradedAnswers), percentage, assessmentId]
        );

        // Result ke hisaab se message
        let resultMessage = '';
        if (percentage >= 80) resultMessage = 'Bohat acha! Excellent performance!';
        else if (percentage >= 60) resultMessage = 'Acha! Good performance!';
        else if (percentage >= 40) resultMessage = 'Theek hai. Average performance.';
        else resultMessage = 'Aur mehnat karo. Keep practicing!';

        res.status(200).json({
            success: true,
            message: 'Assessment complete ho gayi!',
            result: {
                score: percentage,
                total_marks: maxScore,
                obtained_marks: totalScore,
                result_message: resultMessage,
                graded_answers: gradedAnswers
            }
        });

    } catch (error) {
        console.error('SubmitAssessment error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// APNI ASSESSMENTS DEKHNA
// GET /api/assessment/my
// ============================================
const getMyAssessments = async (req, res) => {
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

        const [assessments] = await db.query(
            `SELECT id, skill_domain, score, status, taken_at
             FROM assessments 
             WHERE seeker_id = ?
             ORDER BY taken_at DESC`,
            [profiles[0].id]
        );

        res.status(200).json({
            success: true,
            count: assessments.length,
            assessments
        });

    } catch (error) {
        console.error('GetMyAssessments error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// EK ASSESSMENT KA RESULT DEKHNA
// GET /api/assessment/:id
// ============================================
const getAssessmentResult = async (req, res) => {
    try {
        const [assessments] = await db.query(
            `SELECT a.id, a.skill_domain, a.score, a.answers, a.status, a.taken_at
             FROM assessments a
             JOIN job_seeker_profiles jsp ON a.seeker_id = jsp.id
             WHERE a.id = ? AND jsp.user_id = ?`,
            [req.params.id, req.user.id]
        );

        if (assessments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Assessment nahi mili'
            });
        }

        const assessment = assessments[0];

        res.status(200).json({
            success: true,
            assessment: {
                id: assessment.id,
                skill_domain: assessment.skill_domain,
                score: assessment.score,
                status: assessment.status,
                taken_at: assessment.taken_at,
                answers: assessment.answers ? JSON.parse(assessment.answers) : null
            }
        });

    } catch (error) {
        console.error('GetAssessmentResult error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// AVAILABLE SKILLS LIST
// GET /api/assessment/skills
// ============================================
const getAvailableSkills = async (req, res) => {
    const skills = Object.keys(questionBank).filter(s => s !== 'default');
    res.status(200).json({
        success: true,
        skills
    });
};

module.exports = {
    startAssessment,
    submitAssessment,
    getMyAssessments,
    getAssessmentResult,
    getAvailableSkills
};