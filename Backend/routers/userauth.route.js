import express from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/user.controller.js";
import authenticateToken from "../middleware/user.auth.js";

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/dashboard", authenticateToken, getCurrentUser);

export default router;
