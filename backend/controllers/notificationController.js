const db = require('../config/db');

// ============================================
// NOTIFICATIONS View
// GET /api/notifications
// ============================================
const getNotifications = async (req, res) => {
    try {
        const [notifications] = await db.query(
            `SELECT id, message, type, is_read, sent_at
             FROM notifications
             WHERE user_id = ?
             ORDER BY sent_at DESC
             LIMIT 50`,
            [req.user.id]
        );

        // Unread count
        const [unread] = await db.query(
            `SELECT COUNT(*) as count FROM notifications
             WHERE user_id = ? AND is_read = false`,
            [req.user.id]
        );

        res.status(200).json({
            success: true,
            unread_count: unread[0].count,
            notifications
        });

    } catch (error) {
        console.error('GetNotifications error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// NOTIFICATION Read(read mark karna)
// PUT /api/notifications/:id/read
// ============================================
const markAsRead = async (req, res) => {
    try {
        await db.query(
            `UPDATE notifications SET is_read = true
             WHERE id = ? AND user_id = ?`,
            [req.params.id, req.user.id]
        );

        res.status(200).json({
            success: true,
            message: 'Notification read mark ho gayi'
        });

    } catch (error) {
        console.error('MarkAsRead error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// All NOTIFICATIONS Read
// PUT /api/notifications/read-all
// ============================================
const markAllAsRead = async (req, res) => {
    try {
        await db.query(
            `UPDATE notifications SET is_read = true WHERE user_id = ?`,
            [req.user.id]
        );

        res.status(200).json({
            success: true,
            message: 'Saari notifications read mark ho gayin'
        });

    } catch (error) {
        console.error('MarkAllAsRead error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// NOTIFICATION DELETE
// DELETE /api/notifications/:id
// ============================================
const deleteNotification = async (req, res) => {
    try {
        await db.query(
            `DELETE FROM notifications WHERE id = ? AND user_id = ?`,
            [req.params.id, req.user.id]
        );

        res.status(200).json({
            success: true,
            message: 'Notification delete ho gayi'
        });

    } catch (error) {
        console.error('DeleteNotification error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};