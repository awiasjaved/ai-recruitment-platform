const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// ============================================
// Middleware
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded files (CVs, videos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// Routes Import
// ============================================
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const profileRoutes = require('./routes/profileRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');

// ============================================
// Routes Use
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/interview', interviewRoutes);
// app.use('/api/notifications', notificationRoutes);

// ============================================
// Root Route - Test karne ke liye
// ============================================
app.get('/', (req, res) => {
    res.json({
        message: 'AI Recruitment Platform API is running!',
        version: '1.0.0',
        routes: {
            auth: '/api/auth',
            jobs: '/api/jobs',
            profile: '/api/profile',
            assessment: '/api/assessment',
            interview: '/api/interview',
            // notifications: '/api/notifications'
        }
    });
});

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// ============================================
// Error Handler
// ============================================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
});

// ============================================
// Server Start
// ============================================
const PORT = 3334;
app.listen(PORT, () => {
    console.log(`Server on Running ${PORT}`);
    console.log(`Link: http://localhost:${PORT}`);
});