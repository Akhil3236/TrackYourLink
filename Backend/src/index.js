import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userAuthRouter from "../routers/userauth.route.js";
import linksWebRouter from "../routers/linksweb.route.js";

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
