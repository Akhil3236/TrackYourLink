import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import '../pages/Auth.css';

export const AuthLayout = ({ children }) => {
    return (
        <div className="auth-container">
            <Navbar />

            <main className="auth-card-wrapper">
                {children}
            </main>

            <footer className="auth-footer">
                &copy; {new Date().getFullYear()} TrackYourLink. All rights reserved.
                <div style={{ marginTop: '0.5rem' }}>
                    <Link to="/privacy" style={{ margin: '0 0.5rem' }}>Privacy Policy</Link>
                    <Link to="/terms" style={{ margin: '0 0.5rem' }}>Terms of Service</Link>
                    <Link to="/contact" style={{ margin: '0 0.5rem' }}>Contact</Link>
                </div>
            </footer>
        </div>
    );
};
