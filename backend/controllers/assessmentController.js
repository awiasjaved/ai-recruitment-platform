const db = require('../config/db');

// ============================================
// QUESTION BANK - For Every Skill
// ============================================
const questionBank = {
    'web development': [
        { question: 'What is the benefit of using semantic tags in HTML?', type: 'subjective', marks: 5 },
        { question: 'What is the difference between CSS Flexbox and CSS Grid?', type: 'subjective', marks: 5 },
        { question: 'What is the difference between "==" and "===" in JavaScript?', type: 'mcq', 
          options: ['No difference', '=== checks both value and type', '== is stricter', 'Both are the same'], 
          answer: 1, marks: 2 },
        { question: 'What are the main HTTP methods used in REST APIs?', type: 'subjective', marks: 5 },
        { question: 'What is the purpose of async/await in Node.js?', type: 'subjective', marks: 5 },
        { question: 'What is the use of the useState hook in React?', type: 'mcq', 
          options: ['For styling', 'To manage state', 'For making API calls', 'For routing'], 
          answer: 1, marks: 2 },
        { question: 'Which of the following is used for responsive design in CSS?', type: 'mcq', 
          options: ['Media Queries', 'Float', 'Position', 'Display'], 
          answer: 0, marks: 2 },
        { question: 'What is a Promise in JavaScript?', type: 'subjective', marks: 5 },
        { question: 'What is the main difference between SQL and NoSQL databases?', type: 'subjective', marks: 5 },
        { question: 'What does HTTP status code 404 mean?', type: 'mcq', 
          options: ['Server error', 'Page not found', 'Unauthorized', 'Success'], 
          answer: 1, marks: 2 },
    ],

    'python': [
        { question: 'What is the difference between a list and a tuple in Python?', type: 'subjective', marks: 5 },
        { question: 'What are decorators used for in Python?', type: 'subjective', marks: 5 },
        { question: 'What is the Global Interpreter Lock (GIL) in Python?', type: 'subjective', marks: 5 },
        { question: 'What is the purpose of the __init__ method in Python?', type: 'mcq', 
          options: ['Deletes the class', 'Initializes the class', 'Copies the class', 'Does nothing'], 
          answer: 1, marks: 2 },
        { question: 'Write an example of list comprehension in Python.', type: 'subjective', marks: 5 },
        { question: 'What is the purpose of pip in Python?', type: 'mcq', 
          options: ['To run code', 'To install packages', 'To delete files', 'To run a server'], 
          answer: 1, marks: 2 },
        { question: 'How do you perform exception handling in Python?', type: 'subjective', marks: 5 },
        { question: 'What is a lambda function in Python?', type: 'subjective', marks: 5 },
        { question: 'What is the difference between Django and Flask?', type: 'subjective', marks: 5 },
        { question: 'What is the purpose of the range() function in Python?', type: 'mcq', 
          options: ['Generates random numbers', 'Generates a sequence of numbers', 'Creates strings', 'Stops a loop'], 
          answer: 1, marks: 2 },
    ],

    'data science': [
        { question: 'What is overfitting in Machine Learning?', type: 'subjective', marks: 5 },
        { question: 'What is the Pandas library used for?', type: 'mcq', 
          options: ['Web development', 'Data manipulation and analysis', 'Game development', 'Mobile apps'], 
          answer: 1, marks: 2 },
        { question: 'What is the difference between Supervised and Unsupervised learning?', type: 'subjective', marks: 5 },
        { question: 'What is the role of activation functions in Neural Networks?', type: 'subjective', marks: 5 },
        { question: 'How do you handle null values during data cleaning?', type: 'subjective', marks: 5 },
        { question: 'What is Matplotlib used for?', type: 'mcq', 
          options: ['Database management', 'Data visualization', 'Web scraping', 'File handling'], 
          answer: 1, marks: 2 },
        { question: 'What is a Confusion Matrix?', type: 'subjective', marks: 5 },
        { question: 'What is the Random Forest algorithm?', type: 'subjective', marks: 5 },
        { question: 'Why is feature scaling important?', type: 'subjective', marks: 5 },
        { question: 'What is the purpose of train/test split?', type: 'mcq', 
          options: ['To delete data', 'To split data for training and testing the model', 'To duplicate data', 'To sort data'], 
          answer: 1, marks: 2 },
    ],

    'graphic design': [
        { question: 'What is the difference between RGB and CMYK color models?', type: 'subjective', marks: 5 },
        { question: 'What is the difference between Vector and Raster graphics?', type: 'subjective', marks: 5 },
        { question: 'What is Adobe Photoshop used for?', type: 'mcq', 
          options: ['Video editing', 'Image editing', 'Audio editing', '3D modeling'], 
          answer: 1, marks: 2 },
        { question: 'What is the difference between serif and sans-serif fonts?', type: 'subjective', marks: 5 },
        { question: 'What principles are followed in logo design?', type: 'subjective', marks: 5 },
        { question: 'What does DPI stand for?', type: 'mcq', 
          options: ['Dots Per Inch', 'Design Per Image', 'Digital Print Index', 'Dots Per Icon'], 
          answer: 0, marks: 2 },
        { question: 'Why is color psychology important in design?', type: 'subjective', marks: 5 },
        { question: 'What is the difference between UI and UX design?', type: 'subjective', marks: 5 },
        { question: 'What is Adobe Illustrator mainly used for?', type: 'mcq', 
          options: ['Photo editing', 'Creating vector graphics', 'Video editing', 'Audio mixing'], 
          answer: 1, marks: 2 },
        { question: 'Why is white space important in design?', type: 'subjective', marks: 5 },
    ],

    'mobile development': [
        { question: 'What is the difference between Android and iOS development?', type: 'subjective', marks: 5 },
        { question: 'What is React Native?', type: 'mcq', 
          options: ['A web framework', 'A cross-platform mobile development framework', 'A database', 'A testing tool'], 
          answer: 1, marks: 2 },
        { question: 'What is a widget in Flutter?', type: 'subjective', marks: 5 },
        { question: 'How do you integrate APIs in a mobile app?', type: 'subjective', marks: 5 },
        { question: 'What is an APK file?', type: 'mcq', 
          options: ['iOS file format', 'Android application package file', 'Database file', 'Image file'], 
          answer: 1, marks: 2 },
        { question: 'How do push notifications work?', type: 'subjective', marks: 5 },
        { question: 'How do you add offline functionality in a mobile app?', type: 'subjective', marks: 5 },
        { question: 'What are the steps to publish an app on App Store and Play Store?', type: 'subjective', marks: 5 },
        { question: 'Which framework uses the Dart programming language?', type: 'mcq', 
          options: ['React Native', 'Flutter', 'Xamarin', 'Ionic'], 
          answer: 1, marks: 2 },
        { question: 'What tools are commonly used for mobile app testing?', type: 'subjective', marks: 5 },
    ],

    'default': [
        { question: 'Where do you see yourself in 5 years in your field?', type: 'subjective', marks: 5 },
        { question: 'Tell us about your experience working in a team.', type: 'subjective', marks: 5 },
        { question: 'What is your biggest professional achievement so far?', type: 'subjective', marks: 5 },
        { question: 'What is your approach to problem solving?', type: 'subjective', marks: 5 },
        { question: 'How do you learn new technologies or skills?', type: 'subjective', marks: 5 },
        { question: 'What do you do when you miss a deadline?', type: 'mcq', 
          options: ['Ignore it', 'Inform your manager immediately', 'Do nothing', 'Blame others'], 
          answer: 1, marks: 2 },
        { question: 'How comfortable are you with remote work?', type: 'mcq', 
          options: ['Not at all', 'Somewhat', 'Quite comfortable', 'Very comfortable'], 
          answer: 3, marks: 2 },
        { question: 'Tell us about your communication skills.', type: 'subjective', marks: 5 },
        { question: 'How do you handle difficult coworkers?', type: 'subjective', marks: 5 },
        { question: 'How experienced are you in handling multiple projects simultaneously?', type: 'mcq', 
          options: ['Not experienced', 'Somewhat experienced', 'Experienced', 'Very experienced'], 
          answer: 2, marks: 2 },
    ]
};
// ============================================
// HELPER - Select random questions from the bank
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