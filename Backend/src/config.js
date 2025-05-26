const rateLimit = require("express-rate-limit");

export const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost"
}

// Rate limiting for sensitive routes
export const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: "Too many attempts, please try again after 15 minutes"
});

// Debug middleware
export const debugMiddleware = (req, res, next) => {
    console.log('Request files:', req.files);
    console.log('Request body:', req.body);
    next();
};