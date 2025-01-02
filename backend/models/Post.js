const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // User who commented
            text: { type: String, required: true },  // Comment text
            createdAt: { type: Date, default: Date.now }
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
