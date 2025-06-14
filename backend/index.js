import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./util/db.js";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js"
import { app, server, io } from "./socket/socket.js";
dotenv.config({});

app.use(express.json());
app.use(cookieParser());

app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/comment", commentRoute)
server.listen(process.env.PORT || 8000, () => {
  connectDB();
  console.log(`Server is running port ${process.env.PORT}`);
});
