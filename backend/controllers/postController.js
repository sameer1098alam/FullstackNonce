const Post = require('../models/Post');

// Create a Post
exports.createPost = async (req, res) => {
    const { title, content } = req.body;

    try {
        const post = await Post.create({
            user: req.user.id, // Logged-in user's ID
            title,
            content,
        });
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// Get All Posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'name') // Populate user details (name only)
            .populate('comments.user', 'name') // Populate comment user details
            .sort({ createdAt: -1 }); // Sort posts by latest first
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// Update a Post
exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this post' });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        await post.save();

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// Delete a Post
exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this post' });
        }

        await post.deleteOne();

        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// Like a Post
exports.likePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes.includes(req.user.id)) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        post.likes.push(req.user.id);
        await post.save();

        res.status(200).json({ success: true, message: 'Post liked successfully', data: post });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// Comment on a Post
exports.commentOnPost = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            user: req.user.id,
            text,
        };

        post.comments.push(comment);
        await post.save();

        res.status(200).json({ success: true, message: 'Comment added successfully', data: post });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
};
