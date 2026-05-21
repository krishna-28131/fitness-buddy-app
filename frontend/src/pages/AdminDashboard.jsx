import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
    Users, 
    Activity, 
    Dumbbell, 
    ShieldAlert, 
    ArrowLeft, 
    UserX, 
    ToggleLeft, 
    ToggleRight, 
    Clock, 
    Search,
    Trash2,
    Calendar,
    CheckCircle2,
    XCircle,
    Loader2
} from 'lucide-react';

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [users, setUsers] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'workouts', 'logs'
    const [userSearch, setUserSearch] = useState('');
    const [workoutSearch, setWorkoutSearch] = useState('');
    const [logSearch, setLogSearch] = useState('');

    useEffect(() => {
        // Enforce role protection on frontend
        const userRole = user?.role || user?.user_metadata?.role || 'user';
        if (userRole !== 'admin') {
            navigate('/dashboard');
            return;
        }

        fetchAdminData();
    }, [user, navigate]);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const [usersRes, workoutsRes, logsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/workouts'), // Admin backend returns all workouts on this endpoint
                api.get('/admin/logs')
            ]);
            setUsers(usersRes.data);
            setWorkouts(workoutsRes.data);
            setLogs(logsRes.data);
        } catch (error) {
            console.error("Error fetching admin dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        try {
            await api.put(`/admin/users/${id}/status`, { status: newStatus });
            setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
            
            // Log this action
            await api.post('/logs', {
                action: 'USER_STATUS_UPDATE',
                details: `Admin changed status of user ${id} to ${newStatus}`
            });
            
            // Refresh logs
            const logsRes = await api.get('/admin/logs');
            setLogs(logsRes.data);
        } catch (error) {
            console.error("Failed to toggle status", error);
            alert("Error toggling user status");
        }
    };

    const handleDeleteUser = async (id, email) => {
        if (window.confirm(`Are you sure you want to delete user ${email}?`)) {
            try {
                await api.delete(`/admin/users/${id}`);
                setUsers(users.filter(u => u.id !== id));

                // Log this action
                await api.post('/logs', {
                    action: 'USER_DELETE',
                    details: `Admin deleted user ${email}`
                });

                // Refresh logs
                const logsRes = await api.get('/admin/logs');
                setLogs(logsRes.data);
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Error deleting user");
            }
        }
    };

    const handleDeleteWorkout = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete workout "${title}"?`)) {
            try {
                await api.delete(`/workouts/${id}`);
                setWorkouts(workouts.filter(w => w.id !== id));
                
                // Refresh logs
                const logsRes = await api.get('/admin/logs');
                setLogs(logsRes.data);
            } catch (error) {
                console.error("Failed to delete workout", error);
                alert("Error deleting workout");
            }
        }
    };

    // Filters
    const filteredUsers = users.filter(u => 
        u.email.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.role.toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredWorkouts = workouts.filter(w => 
        w.title.toLowerCase().includes(workoutSearch.toLowerCase()) ||
        w.notes?.toLowerCase().includes(workoutSearch.toLowerCase()) ||
        w.user_id.toLowerCase().includes(workoutSearch.toLowerCase())
    );

    const filteredLogs = logs.filter(l => 
        l.email.toLowerCase().includes(logSearch.toLowerCase()) || 
        l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
        l.details.toLowerCase().includes(logSearch.toLowerCase())
    );

    // Analytics calculations
    const totalUsers = users.length;
    const totalWorkouts = workouts.length;
    const activeUsers = users.filter(u => u.status === 'Active').length;
    const inactiveUsers = users.filter(u => u.status === 'Inactive').length;

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <p className="text-zinc-400 font-medium">Entering Control Room...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30">
            {/* Header Banner */}
            <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800 py-6 px-4 sm:px-6 lg:px-8">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldAlert className="w-48 h-48 text-emerald-500" />
                </div>
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="p-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Admin Control Center</span>
                            </h1>
                            <p className="text-zinc-400 text-sm mt-1">Role-Based Access Management & User Activity Auditing</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Admin Authorization Verified</span>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    {/* Stat Card 1 */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 transition-all hover:border-emerald-500/30">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Users</span>
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white">{totalUsers}</h3>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 transition-all hover:border-cyan-500/30">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Workouts</span>
                            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                                <Dumbbell className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white">{totalWorkouts}</h3>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 transition-all hover:border-emerald-500/20">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Accounts</span>
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-emerald-400">{activeUsers}</h3>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 transition-all hover:border-red-500/20">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Inactive Accounts</span>
                            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                                <XCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-red-400">{inactiveUsers}</h3>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b border-zinc-850 mb-8 overflow-x-auto scrollbar-none">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center space-x-2 py-4 px-6 font-bold text-sm border-b-2 tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                            activeTab === 'users' 
                                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
                                : 'border-transparent text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        <span>User Management</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('workouts')}
                        className={`flex items-center space-x-2 py-4 px-6 font-bold text-sm border-b-2 tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                            activeTab === 'workouts' 
                                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
                                : 'border-transparent text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        <Dumbbell className="w-4 h-4" />
                        <span>Task Monitoring</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`flex items-center space-x-2 py-4 px-6 font-bold text-sm border-b-2 tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                            activeTab === 'logs' 
                                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
                                : 'border-transparent text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                        <Activity className="w-4 h-4" />
                        <span>Activity Logs</span>
                    </button>
                </div>

                {/* Tab Contents */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div>
                            {/* Search bar */}
                            <div className="flex items-center space-x-3 mb-6 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 max-w-md">
                                <Search className="w-5 h-5 text-zinc-500" />
                                <input 
                                    type="text"
                                    placeholder="Search users by email or role..."
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className="bg-transparent border-none text-zinc-100 placeholder:text-zinc-650 w-full outline-none font-medium"
                                />
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                            <th className="py-4 px-4">User ID</th>
                                            <th className="py-4 px-4">Email</th>
                                            <th className="py-4 px-4">Role</th>
                                            <th className="py-4 px-4">Status</th>
                                            <th className="py-4 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-850/50">
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-zinc-500 font-medium">No users found.</td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((u) => (
                                                <tr key={u.id} className="hover:bg-zinc-950/20 transition-colors">
                                                    <td className="py-4 px-4 text-zinc-500 font-mono text-xs">{u.id}</td>
                                                    <td className="py-4 px-4 text-zinc-100 font-semibold">{u.email}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-block text-xs font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider ${
                                                            u.role === 'admin' 
                                                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                                                : 'bg-zinc-800 text-zinc-400'
                                                        }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                                                            u.status === 'Active' 
                                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                            <span>{u.status}</span>
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <button 
                                                                onClick={() => handleToggleStatus(u.id, u.status)}
                                                                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                                                    u.status === 'Active'
                                                                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border-zinc-750'
                                                                        : 'bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 border-emerald-500/20'
                                                                }`}
                                                                title={u.status === 'Active' ? "Deactivate User" : "Activate User"}
                                                            >
                                                                {u.status === 'Active' ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-zinc-500" />}
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteUser(u.id, u.email)}
                                                                className="p-2 bg-red-550/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-550/20 rounded-lg transition-all cursor-pointer"
                                                                title="Delete User Account"
                                                            >
                                                                <UserX className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* WORKOUTS (TASKS) TAB */}
                    {activeTab === 'workouts' && (
                        <div>
                            {/* Search bar */}
                            <div className="flex items-center space-x-3 mb-6 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 max-w-md">
                                <Search className="w-5 h-5 text-zinc-500" />
                                <input 
                                    type="text"
                                    placeholder="Search workouts by title or user ID..."
                                    value={workoutSearch}
                                    onChange={(e) => setWorkoutSearch(e.target.value)}
                                    className="bg-transparent border-none text-zinc-100 placeholder:text-zinc-650 w-full outline-none font-medium"
                                />
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                            <th className="py-4 px-4">Workout Title</th>
                                            <th className="py-4 px-4">Created By</th>
                                            <th className="py-4 px-4">Date</th>
                                            <th className="py-4 px-4">Notes</th>
                                            <th className="py-4 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-850/50">
                                        {filteredWorkouts.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-zinc-500 font-medium">No workouts recorded.</td>
                                            </tr>
                                        ) : (
                                            filteredWorkouts.map((w) => (
                                                <tr key={w.id} className="hover:bg-zinc-950/20 transition-colors">
                                                    <td className="py-4 px-4 text-zinc-100 font-semibold">{w.title}</td>
                                                    <td className="py-4 px-4 text-zinc-400 font-mono text-xs">{w.user_id}</td>
                                                    <td className="py-4 px-4 text-zinc-300">
                                                        <span className="flex items-center space-x-1.5 text-sm font-medium">
                                                            <Calendar className="w-4 h-4 text-zinc-500" />
                                                            <span>{new Date(w.date).toLocaleDateString()}</span>
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-zinc-400 max-w-xs truncate text-sm">{w.notes || '-'}</td>
                                                    <td className="py-4 px-4 text-right">
                                                        <button 
                                                            onClick={() => handleDeleteWorkout(w.id, w.title)}
                                                            className="p-2 bg-red-550/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-555/20 rounded-lg transition-all cursor-pointer"
                                                            title="Delete Workout"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ACTIVITY LOGS TAB */}
                    {activeTab === 'logs' && (
                        <div>
                            {/* Search bar */}
                            <div className="flex items-center space-x-3 mb-6 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 max-w-md">
                                <Search className="w-5 h-5 text-zinc-500" />
                                <input 
                                    type="text"
                                    placeholder="Search logs by email, action, details..."
                                    value={logSearch}
                                    onChange={(e) => setLogSearch(e.target.value)}
                                    className="bg-transparent border-none text-zinc-100 placeholder:text-zinc-650 w-full outline-none font-medium"
                                />
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                            <th className="py-4 px-4">Timestamp</th>
                                            <th className="py-4 px-4">User Email</th>
                                            <th className="py-4 px-4">Action</th>
                                            <th className="py-4 px-4">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-850/50">
                                        {filteredLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="py-8 text-center text-zinc-500 font-medium">No activity logs recorded.</td>
                                            </tr>
                                        ) : (
                                            filteredLogs.map((l) => (
                                                <tr key={l.id} className="hover:bg-zinc-950/20 transition-colors">
                                                    <td className="py-4 px-4 text-zinc-400 font-mono text-xs">
                                                        <span className="flex items-center space-x-1.5">
                                                            <Clock className="w-3.5 h-3.5 text-zinc-650" />
                                                            <span>{new Date(l.timestamp).toLocaleString()}</span>
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-zinc-100 font-semibold text-sm">{l.email}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-block text-xs font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase ${
                                                            l.action.includes('DELETE')
                                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                                : l.action.includes('CREATE')
                                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                : l.action.includes('UPDATE')
                                                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                                                : 'bg-zinc-800 text-zinc-350'
                                                        }`}>
                                                            {l.action}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-zinc-300 text-sm font-medium">{l.details}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
