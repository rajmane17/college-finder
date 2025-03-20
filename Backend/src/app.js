const express = require("express");
const cors = require("cors")
const cookieParser = require("cookie-parser")
const session = require("express-session");

const app = express()

//middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(session({ secret: "your-secret", resave: false, saveUninitialized: true }));

//routes import
const userRouter = require("./routes/user.routes");
const commentRoute = require("./routes/college.routes")
const likeRoute = require("./routes/like.routes");
const collegeRouter = require("./routes/college.routes")

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comment", commentRoute)
app.use("/api/v1/likes", likeRoute);
app.use("/api/v1/colleges", collegeRouter);

module.exports = { app }