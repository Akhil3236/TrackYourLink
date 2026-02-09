import prisma from "../src/prisma.js";
import { encryptSlug } from "../utils/encryption.js";
import emailService from "../services/email.service.js";

// to create a link
export const createLink = async (req, res) => {
    try {
        const { url, slug } = req.body;

        // Validate required fields
        if (!url || !slug) {
            return res.status(400).json({
                success: false,
                message: "URL and slug are required"
            });
        }

        const user = req.user;

        const encryptedSlug = encryptSlug(slug);

        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');

        console.log("Protocol Detected:", protocol, "Host:", host);

        const shortenedUrl = `https://${host}/api/links/${encryptedSlug}`;

        const link = await prisma.links.create({
            data: {
                url,
                slug: encryptedSlug,
                originalSlug: slug,
                shortenedUrl,
                userId: user.id
            }
        });

        res.status(201).json({
            success: true,
            message: "Link created successfully",
            originalUrl: url,
            shortenedUrl: shortenedUrl,
            slug: encryptedSlug,
            originalSlug: slug,
            link: {
                id: link.id,
                url: link.url,
                slug: link.slug,
                shortenedUrl: link.shortenedUrl,
                createdAt: link.createdAt
            }
        });
    } catch (error) {
        console.error("Error creating link:", error);

        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: "This slug is already taken. Please choose a different one."
            });
        }

        res.status(500).json({
            success: false,
            message: "Error creating link",
            error: error.message
        });
    }
};

// to redirect and track analytics when someone clicks the link
export const redirectLink = async (req, res) => {
    try {
        const { slug } = req.params;

        const link = await prisma.links.findUnique({
            where: {
                slug: slug
            },
            include: {
                user: true // Include user to get email for notification
            }
        });

        if (!link) {
            return res.status(404).json({
                success: false,
                message: "Link not found"
            });
        }

        // Track analytics
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        // Create analytics record
        await prisma.analytics.create({
            data: {
                linkId: link.id,
                ipAddress: ipAddress,
                userAgent: userAgent,
                // country and city can be added later with a geolocation service
                country: null,
                city: null
            }
        });

        // Redirect to the original URL
        res.redirect(link.url);

        // Send email notification to link owner if available (async)
        // using the newly added sendLinkClickNotification method

        if (link.user && link.user.email) {
            emailService.sendLinkClickNotification(
                link.user.email,
                link.url,
                link.originalSlug,
                link.slug,
                ipAddress
            ).catch(err => {
                console.error("Failed to send click notification email:", err);
            });
        }
    } catch (error) {
        console.error("Error redirecting link:", error);
        res.status(500).json({
            success: false,
            message: "Error redirecting link",
            error: error.message
        });
    }
};

// to get analytics for a specific link
export const getLinkAnalytics = async (req, res) => {
    try {
        const { slug } = req.params;
        const user = req.user;

        // Find the link and verify ownership
        const link = await prisma.links.findUnique({
            where: {
                slug: slug
            },
            include: {
                analytics: {
                    orderBy: {
                        clickedAt: 'desc'
                    }
                }
            }
        });

        if (!link) {
            return res.status(404).json({
                success: false,
                message: "Link not found"
            });
        }

        // Check if the user owns this link
        if (link.userId !== user.id) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to view this link's analytics"
            });
        }

        // Calculate statistics
        const totalClicks = link.analytics.length;
        const uniqueIPs = new Set(link.analytics.map(a => a.ipAddress)).size;

        res.status(200).json({
            success: true,
            message: "Analytics fetched successfully",
            data: {
                link: {
                    id: link.id,
                    url: link.url,
                    slug: link.slug,
                    shortenedUrl: link.shortenedUrl,
                    createdAt: link.createdAt
                },
                stats: {
                    totalClicks: totalClicks,
                    uniqueVisitors: uniqueIPs
                },
                clicks: link.analytics
            }
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching analytics",
            error: error.message
        });
    }
};


// to get all links created by the user
export const getAllLinks = async (req, res) => {
    try {
        const user = req.user;

        // Find all links created by the user
        const links = await prisma.links.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            message: "Links fetched successfully",
            data: links
        });
    } catch (error) {
        console.error("Error fetching links:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching links",
            error: error.message
        });
    }
};

// user can delete the link
export const deleteLink = async (req, res) => {
    try {
        const { slug } = req.params;
        const user = req.user;

        // Find the link and verify ownership
        const link = await prisma.links.findUnique({
            where: {
                slug: slug
            }
        });

        if (!link) {
            return res.status(404).json({
                success: false,
                message: "Link not found"
            });
        }

        // Check if the user owns this link
        if (link.userId !== user.id) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this link"
            });
        }

        // Delete analytics records and the link in a transaction
        await prisma.$transaction([
            prisma.analytics.deleteMany({
                where: {
                    linkId: link.id
                }
            }),
            prisma.links.delete({
                where: {
                    id: link.id
                }
            })
        ]);

        res.status(200).json({
            success: true,
            message: "Link deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting link:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting link",
            error: error.message
        });
    }
};