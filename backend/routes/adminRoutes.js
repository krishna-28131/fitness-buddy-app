import express from 'express';
import { requireAuth, authorizeRoles } from '../middleware/authMiddleware.js';
import { mockUsers, mockActivityLogs } from '../utils/activityStore.js';

const router = express.Router();

// Apply admin protection to all routes in this file
router.use(requireAuth);
router.use(authorizeRoles('admin'));

// GET /api/admin/users - Get all users
router.get('/users', (req, res) => {
    try {
        res.status(200).json(mockUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/admin/users/:id/status - Update user status
router.put('/users/:id/status', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['Active', 'Inactive'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be Active or Inactive' });
        }

        const user = mockUsers.find(u => u.id === id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.status = status;
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', (req, res) => {
    try {
        const { id } = req.params;
        const index = mockUsers.findIndex(u => u.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        const deletedUser = mockUsers.splice(index, 1)[0];
        res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/logs - Get all activity logs
router.get('/logs', (req, res) => {
    try {
        res.status(200).json(mockActivityLogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
