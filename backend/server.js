import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from './routes/auth.routes.js'
import messageRoutes from "./routes/message.routes.js";
import userRoutes from './routes/user.routes.js';

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();


// Initialize express application

const PORT = process.env.PORT || 5000;
const __dirname =  path.resolve();

// Load environment variables from .env file

/*
        MIDDLEWARE SECTION
*/
app.use(express.json()); //to parse the incoming requests with JSON payloads (from: req.body)
app.use(cookieParser());


// app.use->(  Middleware to handle routes starting with /api/auth/)
app.use("/api/auth", authRoutes);  //authentication routes
app.use("/api/messages", messageRoutes); //get & send:id message
app.use("/api/users", userRoutes);  //get users

app.use(express.static(path.join(__dirname, "./frontend/dist")));

app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "./frontend", "dist", "index.html"));
})





/*
        SERVER SECTION
*/

// Start the server and listen on the specified port
server.listen(PORT, '0.0.0.0',() => {
    connectToMongoDB();
    console.log(`https://localhost:${PORT}, https://192.168.29.199:${PORT}`)
    console.log(`Server is running on PORT: ${PORT}`)

});
