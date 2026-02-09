import { useState } from 'react';
import { Copy, Check, BarChart2, ExternalLink, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LinkCard = ({ link, isLatest = false }) => {
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(link.shortenedUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const [showUrl, setShowUrl] = useState(false);

    const displayTitle = link.originalSlug || 'Untitled Link';

    return (
        <div className={`link-card ${isLatest ? 'new-link' : ''}`}>
            {isLatest && (
                <div className="new-badge">
                    LATEST
                </div>
            )}

            <div className="link-main-info">
                <div
                    className="link-header"
                    style={{ alignItems: 'flex-start', cursor: 'pointer' }}
                    onClick={() => setShowUrl(!showUrl)}
                    onMouseEnter={() => setShowUrl(true)}
                    onMouseLeave={() => setShowUrl(false)}
                    title="Hover or Click to view URL"
                >
                    <Globe size={18} className="text-secondary" style={{ marginRight: 10, marginTop: 4, flexShrink: 0, color: 'var(--text-secondary)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', flex: 1, minWidth: 0 }}>
                        <h3 className="link-url-original" style={{
                            fontSize: '1rem',
                            color: showUrl ? 'var(--text-secondary)' : 'var(--text-primary)',
                            transition: 'color 0.2s'
                        }}>
                            {showUrl ? link.url : displayTitle}
                        </h3>
                        {!showUrl && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                Click to view original URL
                            </span>
                        )}
                        {showUrl && link.originalSlug && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500 }}>
                                Slug: {link.originalSlug}
                            </span>
                        )}
                    </div>
                </div>

                <div className="link-shortened-wrapper">
                    <span className="shortened-link-text">{link.shortenedUrl}</span>
                    <button
                        onClick={copyToClipboard}
                        className="btn-icon-action"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
                    </button>
                    <a
                        href={link.shortenedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-icon-action"
                        title="Open Link"
                    >
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>

            <div className="link-actions-right">
                <span className="link-meta">{formatDate(link.createdAt)}</span>

                <button
                    onClick={() => navigate(`/analytics/${link.slug}`)}
                    className="btn-analytics"
                >
                    <BarChart2 size={16} style={{ marginRight: 6 }} />
                    Analytics
                </button>
            </div>
        </div>
    );
};
