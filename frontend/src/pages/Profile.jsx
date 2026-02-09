import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { linkService } from '../services/linkService';
import { User, Mail, Link as LinkIcon, LogOut, ArrowLeft, Shield, Calendar } from 'lucide-react';
import './Profile.css';
import './Dashboard.css';

export const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [linksCount, setLinksCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await linkService.getAllLinks();
                setLinksCount(response.data ? response.data.length : 0);
            } catch (err) {
                console.error('Failed to fetch stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // calculate join date (mock or real if available, falling back to 'Member')
    const joinDate = "Member since 2026";

    return (
        <div className="profile-page">
            <header className="dashboard-header">
                <h1 onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>TrackYourLink</h1>
                <div className="user-controls">
                    <button onClick={() => navigate('/dashboard')} className="btn-back-nav" style={{ marginRight: '0.5rem' }}>
                        <ArrowLeft size={18} />
                        <span>Dashboard</span>
                    </button>
                    <button onClick={handleLogout} className="btn-logout-header">
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </header>

            <main className="profile-main">
                <div className="profile-card-professional">
                    <div className="profile-cover"></div>

                    <div className="profile-content">
                        <div className="profile-header-group">
                            <div className="profile-avatar-wrapper">
                                <div className="profile-avatar">
                                    <span className="avatar-initial">{user?.name?.charAt(0).toUpperCase()}</span>
                                </div>
                                <div className="status-indicator"></div>
                            </div>

                            <div className="profile-identity">
                                <h2 className="profile-fullname">{user?.name}</h2>
                                <div className="profile-badges">
                                    <span className="badge-plan">
                                        <Shield size={12} fill="currentColor" />
                                        Free Plan
                                    </span>
                                    <span className="badge-member">
                                        <Calendar size={12} />
                                        {joinDate}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-divider"></div>

                        <div className="profile-section-title">Contact Information</div>
                        <div className="profile-field-row">
                            <div className="field-icon">
                                <Mail size={18} />
                            </div>
                            <div className="field-data">
                                <label>Email Address</label>
                                <div className="value">{user?.email}</div>
                            </div>
                            <button className="btn-edit-ghost" disabled>Verified</button>
                        </div>

                        <div className="profile-section-title" style={{ marginTop: '1.5rem' }}>Usage Statistics</div>
                        <div className="stats-mini-grid">
                            <div className="stat-box">
                                <div className="stat-icon-circle blue">
                                    <LinkIcon size={18} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-count">{loading ? '-' : linksCount}</span>
                                    <span className="stat-label">Total Links</span>
                                </div>
                            </div>
                            {/* You could add more stats here, e.g. Total Clicks */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
