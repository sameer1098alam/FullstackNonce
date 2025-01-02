
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Database connection
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes'); // Correct file name and path
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app

// Middleware
const app = express();
const allowedOrigins = [process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : []];


app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json()); // Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/posts', postRoutes); // Post CRUD routes

//deployments



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
