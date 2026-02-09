import prisma from "../src/prisma.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/token.js";
import emailService from "../services/email.service.js";

// to register the user[website]
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        const accessToken = generateAccessToken(user);

        // Send welcome email (async, don't wait for it)
        emailService.sendWelcomeEmail(user.email, user.name).catch(err => {
            console.error('Failed to send welcome email:', err);
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token: accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error registering user:", error);

        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message
        });
    }
};

// to login the user [website]
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        const accessToken = generateAccessToken(user);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token: accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                profilePic: user.profilePic,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            success: false,
            message: "Error logging in user",
            error: error.message
        });
    }
};

// to get the current user details [dashboard]
export const getCurrentUser = async (req, res) => {
    try {
        const user = await prisma.users.findUnique({
            where: {
                id: req.user.id
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                profilePic: user.profilePic,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user",
            error: error.message
        });
    }
};