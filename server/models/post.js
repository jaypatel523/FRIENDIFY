const mongoose = require('mongoose');

const Post = new mongoose.Schema({
    text: {
        type: String,
        required: 'Text is required'
    },
    imageUrl: {
        type: String,
        required: 'Image is required'
    },
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    comments: [{
        text: String,
        created: { type: Date, default: Date.now },
        commentedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
    }],
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', Post)
