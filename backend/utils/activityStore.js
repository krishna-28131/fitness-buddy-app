export let mockUsers = [
    { id: 'mock-user-123', email: 'demo@example.com', role: 'admin', status: 'Active', created_at: '2026-02-27T12:00:00.000Z' },
    { id: 'mock-user-456', email: 'user@example.com', role: 'user', status: 'Active', created_at: '2026-02-27T13:00:00.000Z' },
    { id: 'mock-user-789', email: 'inactive_user@example.com', role: 'user', status: 'Inactive', created_at: '2026-02-27T14:00:00.000Z' }
];

export let mockActivityLogs = [
    { id: 1, userId: 'mock-user-123', email: 'demo@example.com', action: 'LOGIN', details: 'Admin logged in successfully', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, userId: 'mock-user-456', email: 'user@example.com', action: 'TASK_CREATE', details: 'Created workout "Morning Run"', timestamp: new Date(Date.now() - 1800000).toISOString() }
];

export const logActivity = (userId, email, action, details) => {
    mockActivityLogs.unshift({
        id: Date.now(),
        userId,
        email,
        action,
        details,
        timestamp: new Date().toISOString()
    });
};
