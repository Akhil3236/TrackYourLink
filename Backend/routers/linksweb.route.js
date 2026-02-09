import express from "express";
import { createLink, redirectLink, getAllLinks, getLinkAnalytics, deleteLink } from "../controllers/Links.controllers.js";
import authenticateToken from "../middleware/user.auth.js";

const router = express.Router();


router.post("/create", authenticateToken, createLink);
router.get("/analytics/:slug", authenticateToken, getLinkAnalytics);
router.get("/all", authenticateToken, getAllLinks);
router.delete("/:slug", authenticateToken, deleteLink);

router.get("/:slug", redirectLink);

export default router;
