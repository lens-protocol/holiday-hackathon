const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    speaker: {
        id: String,
        name: String,
        character: String,
        bio: String
    },
    recipient: {
        id: String,
        name: String,
        character: String,
        bio: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const conversationSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        unique: true
    },
    participants: [{
        id: String,
        name: String,
        character: String,
        bio: String,
        position: {
            x: Number,
            y: Number
        }
    }],
    messages: [messageSchema],
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: Date,
    totalMessages: {
        type: Number,
        default: 0
    },
    location: {
        x: Number,
        y: Number
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for better query performance
conversationSchema.index({ conversationId: 1 });
conversationSchema.index({ 'participants.id': 1 });
conversationSchema.index({ startTime: -1 });

module.exports = mongoose.model('ConversationHistory', conversationSchema);