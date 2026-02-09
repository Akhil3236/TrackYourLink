import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Check if we are on an auth page to optionally hide buttons or change text, 
    // but the user asked for consistency, so we'll keep the standard layout.
    // We might want to highlight the active link though.

    return (
        <nav className="main-navbar">
            <div className="navbar-content">
                <Link to="/" className="navbar-logo">TrackYourLink</Link>

                <div className="navbar-actions">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="btn-nav-link">Dashboard</Link>
                            <button onClick={logout} className="btn-nav-secondary">Log Out</button>
                        </>
                    ) : (
                        <>
                            {location.pathname !== '/login' && (
                                <Link to="/login" className="btn-nav-link">Log In</Link>
                            )}
                            {location.pathname !== '/register' && (
                                <Link to="/register" className="btn-nav-primary">Get Started</Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
