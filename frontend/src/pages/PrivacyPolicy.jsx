import React from 'react';
import { Navbar } from '../components/Navbar';
import './Legal.css';

export const PrivacyPolicy = () => {
    return (
        <div className="legal-page">
            <Navbar />
            <div className="legal-container">
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2>1. Introduction</h2>
                    <p>Welcome to TrackYourLink. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
                </section>

                <section>
                    <h2>2. Data We Collect</h2>
                    <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                    <ul>
                        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data:</strong> includes email address.</li>
                        <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                        <li><strong>Usage Data:</strong> includes information about how you use our website, products and services (specifically link clicks).</li>
                    </ul>
                </section>

                <section>
                    <h2>3. How We Use Your Data</h2>
                    <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                    <ul>
                        <li>To register you as a new customer.</li>
                        <li>To provide the link tracking services tailored to your account.</li>
                        <li>To manage our relationship with you.</li>
                        <li>To improve our website, products/services, marketing or customer relationships.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Data Security</h2>
                    <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
                </section>

                <section>
                    <h2>5. Contact Us</h2>
                    <p>If you have any questions about this privacy policy or our privacy practices, please contact us.</p>
                </section>
            </div>
        </div>
    );
};
