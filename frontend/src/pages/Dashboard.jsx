import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { linkService } from '../services/linkService';
import { CreateLinkForm } from '../components/CreateLinkForm';
import { LinksList } from '../components/LinksList';
import { CheckCircle, Copy, X, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newLinkData, setNewLinkData] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const response = await linkService.getAllLinks();
            setLinks(response.data || []);
        } catch (err) {
            setError('Failed to fetch links');
        } finally {
            setLoading(false);
        }
    };

    const handleLinkCreated = (newLink) => {
        setNewLinkData(newLink);
        setShowModal(true);
        setLinks([newLink.link, ...links]);
    };

    const closeModal = () => {
        setShowModal(false);
        setCopied(false);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(newLinkData.shortenedUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>TrackYourLink</h1>
                <div className="user-controls">
                    <div
                        className="user-profile-trigger"
                        onClick={() => navigate('/profile')}
                        title="View Profile"
                    >
                        <div className="avatar-circle">
                            <User size={20} />
                        </div>
                        <span className="username">{user?.name}</span>
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="dashboard-grid">
                    <div className="left-panel">
                        <div className="sticky-form">
                            <CreateLinkForm onLinkCreated={handleLinkCreated} />
                        </div>
                    </div>

                    <div className="right-panel">
                        {error && <div className="error">{error}</div>}
                        {loading ? (
                            <div className="loading">Loading links...</div>
                        ) : (
                            <LinksList links={links} />
                        )}
                    </div>
                </div>
            </main>

            {/* Success Modal */}
            {showModal && newLinkData && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                <CheckCircle size={24} color="#10b981" />
                                Link Created Successfully
                            </h2>
                            <button onClick={closeModal} className="modal-close">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="success-info">
                                <div className="info-item">
                                    <span className="info-label">Original URL</span>
                                    <span className="info-value">{newLinkData.originalUrl}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Slug</span>
                                    <span className="info-value">{newLinkData.originalSlug}</span>
                                </div>
                                <div className="info-item highlight">
                                    <span className="info-label">Shortened URL</span>
                                    <div className="shortened-url-container">
                                        <input
                                            type="text"
                                            value={newLinkData.shortenedUrl}
                                            readOnly
                                            className="shortened-url-input"
                                        />
                                        <button
                                            onClick={copyToClipboard}
                                            className="btn-copy-modal"
                                        >
                                            {copied ? (
                                                <>
                                                    <CheckCircle size={16} />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={16} />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={closeModal} className="btn-primary">Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
