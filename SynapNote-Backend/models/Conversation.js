import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const conversationSchema = mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    note: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
        required: true,
        index: true
    },
    messages: [messageSchema],
    isActive: {
        type: Boolean,
        default: true
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient queries
conversationSchema.index({ user: 1, note: 1 });
conversationSchema.index({ lastActivity: 1 }); // For cleanup queries

// Middleware to update lastActivity on save
conversationSchema.pre('save', function(next) {
    this.lastActivity = new Date();
    next();
});

// Static method to cleanup old conversations (older than 7 days)
conversationSchema.statics.cleanupOldConversations = async function(daysOld = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const result = await this.deleteMany({
        lastActivity: { $lt: cutoffDate }
    });
    
    return result.deletedCount;
};

// Instance method to add a message
conversationSchema.methods.addMessage = function(role, content) {
    this.messages.push({ role, content });
    this.lastActivity = new Date();
    
    // Limit messages to prevent excessive growth (keep last 50 messages)
    if (this.messages.length > 50) {
        this.messages = this.messages.slice(-50);
    }
    
    return this.save();
};

// Instance method to get recent messages
conversationSchema.methods.getRecentMessages = function(limit = 20) {
    return this.messages.slice(-limit);
};

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
