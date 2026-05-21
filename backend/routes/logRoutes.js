import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { logActivity } from '../utils/activityStore.js';

const router = express.Router();

// POST /api/logs - Log a user activity
router.post('/', requireAuth, (req, res) => {
    try {
        const { action, details } = req.body;
        if (!action || !details) {
            return res.status(400).json({ error: 'Action and details are required' });
        }

        logActivity(req.user.id, req.user.email, action, details);
        res.status(201).json({ message: 'Activity logged successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
