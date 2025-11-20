import { GoogleGenerativeAI } from "@google/generative-ai";
import Conversation from "../models/Conversation.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
const model2 = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
export const generateKeywords = async (content) => {
    try {
        const prompt = `Extract 5-10 relevant keywords from the following text. Return only the keywords separated by commas, no other text or explanations:
${content}`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const keywords = response.text()
            .split(',')
            .map(keyword => keyword.trim())
            .filter(keyword => keyword.length > 0);
        console.log(keywords);
        
        return keywords;
    } catch (error) {
        console.error('Error generating keywords:', error);
        return [];
    }
};

export const generateSummary = async (content) => {
    try {        
        const prompt = `
        Generate a concise summary of the following text. Return only the summary, no other text or explanations:
        ${content}`;
        const result = await model2.generateContent(prompt);
        const response = result.response;
        const summary = response.text();
        console.log(summary);
        return summary;
    } catch (error) {
        console.error('Error generating summary:', error);
        return '';
    }
};

export const suggestTitle = async (content)=>{
    try {
        const prompt = `
        Generate a title for the following text. Return only the title, no other text or explanations:
        ${content}`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const title = response.text();
        console.log(title);
        return title;
    } catch (error) {
        console.log(error);
        return ''
    }
}

export const improveContent = async (content)=>{
    try {
        const prompt = `
        Improve the following text. Return only the improved text and grammer, no other text or explanations and content should be remain same as original:
        ${content}`;
        const result = await model2.generateContent(prompt);
        const response = result.response;
        const improvedContent = response.text();
        console.log(improvedContent);
        return improvedContent;
    } catch (error) {
        console.log(error);
        return ''
    }
}

export const genContent  = async (topic)=>{
    try {
        const prompt = `
        Generate Notes For The Given Topic , Notes Should Be Easy To Understand :
        ${topic}`;
        const result = await model2.generateContent(prompt);
        const response = result.response;
        const content = response.text();
        // console.log(content);
        return content;
    } catch (error) {
        console.log(error);
        return ''
    }
}

export const chatWithNoteAI = async (noteId, userId, userMessage, sessionId = null, noteContext = '') => {
    try {
        let conversation;
        
        if (sessionId) {
            conversation = await Conversation.findOne({ 
                sessionId, 
                user: userId, 
                note: noteId,
                isActive: true 
            });
        }
        
        if (!conversation) {
            sessionId = `note_${noteId}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
            conversation = new Conversation({
                sessionId,
                user: userId,
                note: noteId,
                messages: []
            });
        }
        
        const recentMessages = conversation.getRecentMessages(10);
        
        // Build conversation context from history
        const conversationContext = recentMessages
            .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n');
        
        const prompt = `
            You are an intelligent note assistant. You have access to a specific note and can answer questions about it.
            
            NOTE CONTEXT:
            ${noteContext}
            
            PREVIOUS CONVERSATION:
            ${conversationContext}
            
            USER QUESTION: ${userMessage}
            
            Instructions:
            - Answer questions based on the note content
            - If the question is not related to the note, politely redirect to note-related topics
            - Be helpful and provide insights about the note
            - You can suggest improvements, ask clarifying questions, or provide summaries
            - Keep responses concise but informative
            
            Response:
        `;
        
        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();
        
        // Add messages to conversation
        await conversation.addMessage('user', userMessage);
        await conversation.addMessage('assistant', aiResponse);
        
        return { 
            response: aiResponse, 
            sessionId: conversation.sessionId,
            conversationId: conversation._id 
        };
        
    } catch (error) {
        console.error('AI service error:', error);
        throw error;
    }
};

// Database-based conversation management functions
export const getConversationHistory = async (userId, noteId, sessionId = null) => {
    try {
        const query = { user: userId, note: noteId, isActive: true };
        if (sessionId) query.sessionId = sessionId;
        
        const conversations = await Conversation.find(query)
            .sort({ lastActivity: -1 })
            .limit(sessionId ? 1 : 10)
            .populate('user', 'name email')
            .populate('note', 'title');
        
        return conversations;
    } catch (error) {
        console.error('Error fetching conversation history:', error);
        return [];
    }
};

export const clearConversation = async (sessionId, userId) => {
    try {
        const result = await Conversation.findOneAndUpdate(
            { sessionId, user: userId },
            { isActive: false },
            { new: true }
        );
        return !!result;
    } catch (error) {
        console.error('Error clearing conversation:', error);
        return false;
    }
};

export const deleteConversation = async (sessionId, userId) => {
    try {
        const result = await Conversation.findOneAndDelete({
            sessionId,
            user: userId
        });
        return !!result;
    } catch (error) {
        console.error('Error deleting conversation:', error);
        return false;
    }
};

// Utility function to clean up old conversations (can be called periodically)
export const cleanupOldConversations = async (daysOld = 7) => {
    try {
        const deletedCount = await Conversation.cleanupOldConversations(daysOld);
        console.log(`Cleaned up ${deletedCount} old conversations`);
        return deletedCount;
    } catch (error) {
        console.error('Error cleaning up conversations:', error);
        return 0;
    }
};

// Auto-cleanup old conversations daily (24 hours)
setInterval(async () => {
    await cleanupOldConversations();
}, 24 * 60 * 60 * 1000);