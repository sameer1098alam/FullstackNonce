const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    likePost,
    commentOnPost
} = require('../controllers/postController'); // Correct path to your controller

const authMiddleware = require('../middleware/authMiddleware'); // Import the authMiddleware

// Route Definitions
router.post('/', authMiddleware, createPost); // Create a post (requires authentication)
router.get('/', getPosts);   // Get all posts (no authentication required)
router.put('/:id', authMiddleware, updatePost); // Update a post (requires authentication)
router.delete('/:id', authMiddleware, deletePost); // Delete a post (requires authentication)
router.post('/:id/like', authMiddleware, likePost); // Like a post (requires authentication)
router.post('/:id/comment', authMiddleware, commentOnPost); // Comment on a post (requires authentication)

module.exports = router;
