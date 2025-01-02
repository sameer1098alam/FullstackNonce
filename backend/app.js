
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
const app = express();

// Middleware
app.use(cors()); // Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/posts', postRoutes); // Post CRUD routes

//deployments



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
