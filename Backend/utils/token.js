import jwt from "jsonwebtoken";

function generateAccessToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
    );
}



export { generateAccessToken };
