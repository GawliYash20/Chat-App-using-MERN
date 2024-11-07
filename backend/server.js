import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from './routes/auth.routes.js'
import messageRoutes from "./routes/message.routes.js";
import userRoutes from './routes/user.routes.js';

import connectToMongoDB from "./db/connectToMongoDB.js";

// Initialize express application
const app = express();
const PORT = process.env.PORT || 5000;

// Load environment variables from .env file
dotenv.config();

/*
        MIDDLEWARE SECTION
*/
app.use(express.json()); //to parse the incoming requests with JSON payloads (from: req.body)
app.use(cookieParser());


// app.use->(  Middleware to handle routes starting with /api/auth/)
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


// // Define a route handler for the default home page
// app.get("/", (req, res) => {
//     // Root route http://localhost:5000/
//     res.send("Hello world!!");
// });



/*
        SERVER SECTION
*/

// Start the server and listen on the specified port
app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on PORT: ${PORT}`)

});
