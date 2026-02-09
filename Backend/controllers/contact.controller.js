
import emailService from "../services/email.service.js";

// Handle contact form submission
export const submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // Send contact email
        const result = await emailService.sendContactEmail(name, email, message);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: "Your message has been sent successfully. We'll get back to you soon!"
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Failed to send message. Please try again later."
            });
        }
    } catch (error) {
        console.error("Error submitting contact form:", error);
        res.status(500).json({
            success: false,
            message: "Error submitting contact form",
            error: error.message
        });
    }
};
