import { createTransporter } from '../config/email.config.js';
import dotenv from 'dotenv';
dotenv.config();

class EmailService {
    constructor() {
        this.transporter = createTransporter();
        this.fromEmail = process.env.EMAIL_FROM || 'TrackYourLink <noreply@trackyourlink.com>';
    }

    // Send welcome email
    async sendWelcomeEmail(userEmail, userName) {
        const mailOptions = {
            from: this.fromEmail,
            to: userEmail,
            subject: 'Welcome to TrackYourLink',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f9fafb; }
                        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
                        .header { background: #ffffff; padding: 32px 40px; border-bottom: 1px solid #f3f4f6; text-align: left; }
                        .logo { font-size: 24px; font-weight: 700; color: #4f46e5; text-decoration: none; }
                        .content { padding: 40px; }
                        .h1 { font-size: 24px; font-weight: 600; color: #111827; margin: 0 0 24px; }
                        .text { font-size: 16px; color: #374151; margin: 0 0 24px; }
                        .button-container { margin: 32px 0; }
                        .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; }
                        .button:hover { background: #4338ca; }
                        .list { margin: 24px 0; padding-left: 20px; color: #374151; }
                        .list li { margin-bottom: 12px; }
                        .footer { background: #f9fafb; padding: 32px 40px; border-top: 1px solid #f3f4f6; text-align: center; color: #6b7280; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <span class="logo">TrackYourLink</span>
                        </div>
                        <div class="content">
                            <h1 class="h1">Welcome, ${userName}</h1>
                            <p class="text">Thank you for joining TrackYourLink. We are excited to have you on board.</p>
                            <p class="text">You now have access to powerful link management tools:</p>
                            <ul class="list">
                                <li>Create custom short links</li>
                                <li>Track real-time analytics</li>
                                <li>Monitor geographic data</li>
                                <li>Analyze audience statistics</li>
                            </ul>
                            <div class="button-container">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="button">Go to Dashboard</a>
                            </div>
                            <p class="text" style="font-size: 14px; color: #6b7280;">If you have any questions, please reply to this email or contact support.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} TrackYourLink. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Welcome email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending welcome email:', error);
            return { success: false, error: error.message };
        }
    }

    // Send password reset email
    async sendPasswordResetEmail(userEmail, userName, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: this.fromEmail,
            to: userEmail,
            subject: 'Reset Password',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f9fafb; }
                        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
                        .header { background: #ffffff; padding: 32px 40px; border-bottom: 1px solid #f3f4f6; text-align: left; }
                        .logo { font-size: 24px; font-weight: 700; color: #4f46e5; text-decoration: none; }
                        .content { padding: 40px; }
                        .h1 { font-size: 24px; font-weight: 600; color: #111827; margin: 0 0 24px; }
                        .text { font-size: 16px; color: #374151; margin: 0 0 24px; }
                        .button-container { margin: 32px 0; }
                        .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; }
                        .button:hover { background: #4338ca; }
                        .footer { background: #f9fafb; padding: 32px 40px; border-top: 1px solid #f3f4f6; text-align: center; color: #6b7280; font-size: 12px; }
                        .link { color: #4f46e5; word-break: break-all; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <span class="logo">TrackYourLink</span>
                        </div>
                        <div class="content">
                            <h1 class="h1">Reset Your Password</h1>
                            <p class="text">We received a request to reset your password. Click the button below to choose a new password:</p>
                            <div class="button-container">
                                <a href="${resetUrl}" class="button">Reset Password</a>
                            </div>
                            <p class="text">This link will expire in 1 hour.</p>
                            <p class="text" style="font-size: 14px;">Or copy this link to your browser:</p>
                            <p class="text"><a href="${resetUrl}" class="link">${resetUrl}</a></p>
                        </div>
                        <div class="footer">
                            <p>If you did not request a password reset, please ignore this email.</p>
                            <p>&copy; ${new Date().getFullYear()} TrackYourLink. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Password reset email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending password reset email:', error);
            return { success: false, error: error.message };
        }
    }

    // Send link analytics summary email
    async sendAnalyticsSummary(userEmail, userName, linkData) {
        const mailOptions = {
            from: this.fromEmail,
            to: userEmail,
            subject: 'Weekly Analytics Summary',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f9fafb; }
                        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
                        .header { background: #ffffff; padding: 32px 40px; border-bottom: 1px solid #f3f4f6; text-align: left; }
                        .logo { font-size: 24px; font-weight: 700; color: #4f46e5; text-decoration: none; }
                        .content { padding: 40px; }
                        .h1 { font-size: 24px; font-weight: 600; color: #111827; margin: 0 0 24px; }
                        .text { font-size: 16px; color: #374151; margin: 0 0 24px; }
                        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 32px 0; }
                        .stat-card { background: #f9fafb; padding: 24px; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb; }
                        .stat-value { font-size: 32px; font-weight: 700; color: #4f46e5; margin-bottom: 8px; }
                        .stat-label { font-size: 14px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
                        .button-container { margin: 32px 0; text-align: center; }
                        .button { display: inline-block; background: #ffffff; color: #4f46e5; padding: 12px 24px; text-decoration: none; border: 1px solid #e5e7eb; border-radius: 6px; font-weight: 500; font-size: 16px; }
                        .button:hover { background: #f9fafb; border-color: #d1d5db; }
                        .footer { background: #f9fafb; padding: 32px 40px; border-top: 1px solid #f3f4f6; text-align: center; color: #6b7280; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <span class="logo">TrackYourLink</span>
                        </div>
                        <div class="content">
                            <h1 class="h1">Weekly Performance</h1>
                            <p class="text">Here is a summary of your link performance for this week:</p>
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <div class="stat-value">${linkData.totalClicks || 0}</div>
                                    <div class="stat-label">Total Clicks</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value">${linkData.activeLinks || 0}</div>
                                    <div class="stat-label">Active Links</div>
                                </div>
                            </div>
                            <div class="button-container">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="button">View Dashboard</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} TrackYourLink. All rights reserved.</p>
                            <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a></p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Analytics summary email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending analytics summary email:', error);
            return { success: false, error: error.message };
        }
    }

    // Send contact form email
    async sendContactEmail(name, email, message) {
        const mailOptions = {
            from: this.fromEmail,
            to: process.env.SUPPORT_EMAIL || 'support@trackyourlink.com',
            replyTo: email,
            subject: `Contact Form: ${name}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f9fafb; }
                        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
                        .header { background: #ffffff; padding: 24px 40px; border-bottom: 1px solid #f3f4f6; }
                        .logo { font-size: 20px; font-weight: 700; color: #1f2937; }
                        .content { padding: 40px; }
                        .row { margin-bottom: 24px; }
                        .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 600; display: block; margin-bottom: 8px; }
                        .value { font-size: 16px; color: #111827; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb; }
                        .message-box { background: #f9fafb; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap; }
                        .footer { background: #f9fafb; padding: 24px 40px; border-top: 1px solid #f3f4f6; text-align: center; color: #6b7280; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <span class="logo">New Support Message</span>
                        </div>
                        <div class="content">
                            <div class="row">
                                <span class="label">From</span>
                                <div class="value">${name} (${email})</div>
                            </div>
                            <div class="row">
                                <span class="label">Message</span>
                                <div class="value message-box">${message}</div>
                            </div>
                        </div>
                        <div class="footer">
                            <p>Received at ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Contact form email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending contact form email:', error);
            return { success: false, error: error.message };
        }
    }

    // Send link click notification
    async sendLinkClickNotification(linkOwnerEmail, linkUrl, originalSlug, linkSlug, ipAddress) {
        const mailOptions = {
            from: this.fromEmail,
            to: linkOwnerEmail,
            subject: `New Click Detected`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f9fafb; }
                        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
                        .header { background: #ffffff; padding: 24px 40px; border-bottom: 1px solid #f3f4f6; text-align: left; }
                        .logo { font-size: 20px; font-weight: 700; color: #4f46e5; text-decoration: none; }
                        .content { padding: 40px; }
                        .h1 { font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 24px; }
                        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
                        .data-table td { padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 15px; }
                        .data-table td:first-child { width: 120px; color: #6b7280; font-weight: 500; }
                        .data-table td:last-child { color: #111827; font-weight: 500; text-align: right; }
                        .button { display: block; width: 100%; text-align: center; background: #ffffff; color: #4f46e5; padding: 12px 0; text-decoration: none; border: 1px solid #e5e7eb; border-radius: 6px; font-weight: 500; font-size: 16px; margin-top: 24px; }
                        .button:hover { background: #f9fafb; border-color: #d1d5db; }
                        .footer { background: #f9fafb; padding: 24px 40px; border-top: 1px solid #f3f4f6; text-align: center; color: #6b7280; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <span class="logo">TrackYourLink</span>
                        </div>
                        <div class="content">
                            <h1 class="h1">New Click Detected</h1>
                            
                            <table class="data-table">
                                <tr>
                                    <td>Link Slug</td>
                                    <td>/${linkSlug}</td>
                                </tr>
                                <tr>
                                    <td>Destination</td>
                                    <td style="color: #6b7280; font-weight: normal; overflow-wrap: break-word; max-width: 300px;">${linkUrl}</td>
                                </tr>
                                <tr>
                                    <td>IP Address</td>
                                    <td>${ipAddress}</td>
                                </tr>
                                <tr>
                                    <td>Time</td>
                                    <td>${new Date().toLocaleString()}</td>
                                </tr>
                            </table>

                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/analytics/${linkSlug}" class="button">View Detailed Analytics</a>
                        </div>
                        <div class="footer">
                            <p>You received this notification because you enabled alerts for this link.</p>
                            <p>&copy; ${new Date().getFullYear()} TrackYourLink. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Link click notification sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending link click notification:', error);
            return { success: false, error: error.message };
        }
    }
}

const emailService = new EmailService();
export default emailService;
