import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import './Contact.css';

export const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                setFormData({ name: '', email: '', message: '' });
            } else {
                toast.error(data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-page">
            <Navbar />
            <div className="contact-container">
                <div className="contact-header">
                    <Mail size={48} className="contact-icon" />
                    <h1>Get in Touch</h1>
                    <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                </div>

                <div className="contact-content">
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="6"
                                placeholder="Tell us what's on your mind..."
                            />
                        </div>

                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>Sending...</>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>

                    <div className="contact-info">
                        <div className="info-card">
                            <h3>📧 Email</h3>
                            <p>support@trackyourlink.com</p>
                        </div>
                        <div className="info-card">
                            <h3>⏰ Response Time</h3>
                            <p>We typically respond within 24 hours</p>
                        </div>
                        <div className="info-card">
                            <h3>💬 Support Hours</h3>
                            <p>Monday - Friday, 9AM - 6PM EST</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
