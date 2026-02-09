import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { linkService } from '../services/linkService';
import { parseUserAgent } from '../utils/userAgentParser';
import {
    ArrowLeft,
    BarChart2,
    Users,
    Globe,
    Clock,
    Laptop,
    X,
    ExternalLink,
    Calendar,
    Copy,
    Check,
    Trash2,
    AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Analytics.css';

export const Analytics = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState('');
    const [selectedClick, setSelectedClick] = useState(null);
    const [copied, setCopied] = useState(false);
    const [timeRange, setTimeRange] = useState('7d');

    const getChartData = () => {
        if (!analytics?.clicks) return [];

        const now = new Date();
        now.setHours(23, 59, 59, 999);

        let startDate = new Date();
        if (timeRange === '7d') startDate.setDate(now.getDate() - 6);
        if (timeRange === '30d') startDate.setDate(now.getDate() - 29);
        if (timeRange === 'all') {
            if (analytics.clicks.length === 0) return [];
            const dates = analytics.clicks.map(c => new Date(c.clickedAt).getTime());
            startDate = new Date(Math.min(...dates));
        }
        startDate.setHours(0, 0, 0, 0);

        // Create Map of all dates in range initialized to 0
        const dataMap = new Map();
        for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
            const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dataMap.set(key, 0);
        }

        // Populate with counts
        analytics.clicks.forEach(click => {
            const clickDate = new Date(click.clickedAt);
            // Ensure click is within range (crucial for 'all' if we just set startDate, 
            // but for 7d/30d filter is needed)
            if (clickDate >= startDate && clickDate <= now) {
                const key = clickDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (dataMap.has(key)) {
                    dataMap.set(key, dataMap.get(key) + 1);
                } else if (timeRange === 'all') {
                    // In 'all' mode, if we missed some days due to date iterator skipping? 
                    // No, date iterator covers all.
                    dataMap.set(key, (dataMap.get(key) || 0) + 1);
                }
            }
        });

        // Convert Map to Array
        return Array.from(dataMap.entries()).map(([name, clicks]) => ({ name, clicks }));
    };

    useEffect(() => {
        fetchAnalytics();
    }, [slug]);

    const fetchAnalytics = async () => {
        try {
            const response = await linkService.getAnalytics(slug);
            setAnalytics(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await linkService.deleteLink(slug);
            toast.success('Link deleted successfully');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.message || 'Failed to delete link');
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(analytics.link.shortenedUrl);
            setCopied(true);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    };

    const openModal = (click) => {
        setSelectedClick(click);
    };

    const closeModal = () => {
        setSelectedClick(null);
    };

    if (loading) {
        return <div className="loading">Loading analytics...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Unable to load analytics</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/dashboard')} className="btn-primary">
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <div className="header-left">
                    <button onClick={() => navigate('/dashboard')} className="btn-back">
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <h1>Analytics Overview</h1>
                </div>
                <button
                    onClick={handleDelete}
                    className="btn-delete"
                    disabled={deleting}
                    title="Delete Link"
                >
                    <Trash2 size={18} />
                    {deleting ? 'Deleting...' : 'Delete Link'}
                </button>
            </div>

            <div className="analytics-container">
                {/* Link Info Card */}
                <div className="analytics-card link-info-card">
                    <h2>Link Details</h2>
                    <div className="info-row">
                        <span className="label">Destination URL</span>
                        <a href={analytics.link.url} target="_blank" rel="noopener noreferrer" className="link-value">
                            {analytics.link.url} <ExternalLink size={12} style={{ marginLeft: 4, display: 'inline' }} />
                        </a>
                    </div>
                    <div className="info-row">
                        <span className="label">Shortened URL</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-end', flex: 1, minWidth: 0 }}>
                            <span className="link-value" style={{ flex: 1, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis' }}>{analytics.link.shortenedUrl}</span>
                            <button onClick={handleCopy} className="btn-copy-icon" title="Copy URL">
                                {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>
                    <div className="info-row">
                        <span className="label">Created On</span>
                        <span>{formatDate(analytics.link.createdAt)}</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <BarChart2 size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{analytics.stats.totalClicks}</div>
                            <div className="stat-label">Total Clicks</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Users size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{analytics.stats.uniqueVisitors}</div>
                            <div className="stat-label">Unique Visitors</div>
                        </div>
                    </div>
                </div>

                {/* Traffic Graph */}
                <div className="analytics-card chart-card">
                    <div className="card-header-row">
                        <h2>Traffic Over Time</h2>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="chart-filter-select"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                    <div className="chart-container" style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={getChartData()}>
                                <defs>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                    minTickGap={30}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="clicks"
                                    stroke="#8884d8"
                                    fillOpacity={1}
                                    fill="url(#colorClicks)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Clicks Table */}
                <div className="analytics-card clicks-table-card">
                    <h2>Recent Activity ({analytics.clicks.length})</h2>
                    {analytics.clicks.length === 0 ? (
                        <div className="empty-state">
                            <Clock className="empty-state-icon" />
                            <p>No activity recorded yet</p>
                            <span className="empty-state-subtext">Share your link to start tracking!</span>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="clicks-table">
                                <thead>
                                    <tr>
                                        <th>Date & Time</th>
                                        <th>IP Address</th>
                                        <th>Device / Browser</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.clicks.map((click) => {
                                        const parsed = parseUserAgent(click.userAgent);
                                        return (
                                            <tr key={click.id}>
                                                <td>{formatDate(click.clickedAt)}</td>
                                                <td>{click.ipAddress || 'Unknown'}</td>
                                                <td className="user-agent">
                                                    {parsed.browser} on {parsed.os}
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => openModal(click)}
                                                        className="btn-view-details"
                                                    >
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {selectedClick && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                <Clock size={20} style={{ marginRight: 8 }} />
                                Click Details
                            </h2>
                            <button onClick={closeModal} className="modal-close">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-row">
                                <span className="detail-label">Time</span>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span className="detail-value" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                                        {formatRelativeTime(selectedClick.clickedAt)}
                                    </span>
                                    <span className="detail-value" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {formatDate(selectedClick.clickedAt)}
                                    </span>
                                </div>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">IP Address</span>
                                <span className="detail-value">{selectedClick.ipAddress || 'Unknown'}</span>
                            </div>

                            {/* User Agent Breakdown */}
                            <div className="ua-section">
                                <h3 className="ua-heading">Device Information</h3>
                                {(() => {
                                    const parsed = parseUserAgent(selectedClick.userAgent);
                                    return (
                                        <div className="ua-grid">
                                            <div className="ua-item">
                                                <span className="ua-label">Browser</span>
                                                <span className="ua-value">{parsed.browser} {parsed.browserVersion}</span>
                                            </div>
                                            <div className="ua-item">
                                                <span className="ua-label">OS</span>
                                                <span className="ua-value">{parsed.os} {parsed.osVersion}</span>
                                            </div>
                                            <div className="ua-item">
                                                <span className="ua-label">Device</span>
                                                <span className="ua-value">{parsed.device}</span>
                                            </div>
                                            <div className="ua-item">
                                                <span className="ua-label">Platform</span>
                                                <span className="ua-value">{parsed.platform}</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="detail-row full-width" style={{ marginTop: '1.5rem' }}>
                                <span className="detail-label">Raw User Agent</span>
                                <span className="detail-value user-agent-full" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {selectedClick.userAgent || 'N/A'}
                                </span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={closeModal} className="btn-primary">Close</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay danger-overlay" onClick={() => !deleting && setShowDeleteModal(false)}>
                    <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-body delete-modal-body">
                            <div className="delete-warning-icon">
                                <AlertTriangle size={36} color="#ef4444" />
                            </div>
                            <h2>Delete Link?</h2>
                            <p>This action cannot be undone. All tracking data for <strong>{analytics.link.shortenedUrl}</strong> will be permanently deleted.</p>

                            <div className="delete-modal-actions">
                                <button
                                    className="btn-cancel"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn-confirm-delete"
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? (
                                        <>
                                            <span className="spinner-small"></span>
                                            Deleting...
                                        </>
                                    ) : (
                                        'Yes, Delete Link'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
