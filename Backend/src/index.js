import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userAuthRouter from "../routers/userauth.route.js";
import linksWebRouter from "../routers/linksweb.route.js";
import contactRouter from "../routers/contact.route.js";

dotenv.config();

const app = express();

// Trust proxy to get correct req.protocol (https) when behind a load balancer/proxy
app.set('trust proxy', true);


// CORS configuration
const corsOptions = {
    origin: [
        'https://trackur.online',
        'http://localhost:5173',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    optionsSuccessStatus: 200
};


app.use(cors(corsOptions));
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "Hello World!" });
});

app.use("/api/auth", userAuthRouter);
app.use("/api/links", linksWebRouter);
app.use("/api/contact", contactRouter);


const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.on('error', (error) => {
    console.error("Server error:", error);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

