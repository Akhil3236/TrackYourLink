import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Globe, ShieldCheck } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import './Landing.css';

export const Landing = () => {
    return (
        <div className="landing-page">
            <Navbar />

            <header className="hero-section">
                <h1 className="hero-title">
                    Track Every Click, <br />
                    <span className="hero-highlight">Optimize Every Link.</span>
                </h1>
                <p className="hero-subtitle">
                    The ultimate link management platform for modern creators. Shorten URLs, create custom slugs, and get real-time insights into your audience.
                </p>
                <div className="hero-cta-group">
                    <Link to="/register" style={{ textDecoration: 'none', padding: '0.9rem 2rem', background: '#000', color: '#fff', borderRadius: '8px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        Start Tracking Free <ArrowRight size={18} />
                    </Link>
                    <Link to="/login" style={{ textDecoration: 'none', padding: '0.9rem 2rem', background: '#fff', color: '#333', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: 600 }}>
                        Live Demo
                    </Link>
                </div>
            </header>

            <section className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2>Why Choose TrackYourLink?</h2>
                        <p style={{ maxWidth: 600, margin: '0 auto', color: 'var(--text-secondary)' }}>
                            Built for performance and simplicity. Everything you need to manage your links in one place.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <BarChart2 size={24} />
                            </div>
                            <h3>Real-Time Analytics</h3>
                            <p>Get instant feedback on your link performance. Track clicks, unique visitors, and geographic data.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Globe size={24} />
                            </div>
                            <h3>Custom Slugs</h3>
                            <p>Create branded, memorable links like <code>link.co/my-brand</code> instead of random characters.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <ShieldCheck size={24} />
                            </div>
                            <h3>Secure & Reliable</h3>
                            <p>Enterprise-grade uptime and security. Your links are always up and your data is protected.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <div className="footer-content">
                    <div style={{ textAlign: 'left' }}>
                        <div className="landing-logo" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>TrackYourLink</div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
                            &copy; {new Date().getFullYear()} TrackYourLink. All rights reserved.
                        </p>
                    </div>
                    <div className="footer-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <a href="mailto:support@trackyourlink.com">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
