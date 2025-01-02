const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    // Retrieve the token from the 'Authorization' header
    const token = req.header('Authorization')?.split(' ')[1];

    // If no token is provided, return a 401 error
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        // Verify the token using the secret key from the environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user associated with the decoded token ID
        req.user = await User.findById(decoded.id).select('-password');

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If the token is invalid or expired, return a 401 error
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
