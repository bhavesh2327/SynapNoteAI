import Note from "../models/Notes.js";
import User from "../models/User.js";
import { 
    chatWithNoteAI, 
    genContent, 
    generateKeywords, 
    generateSummary, 
    improveContent, 
    suggestTitle,
    getConversationHistory,
    clearConversation,
    deleteConversation 
} from "../services/aiServices.js";

export const createNote = async (req, res) => {
  try {
    // user input -> title , content , tags
    // then validate user input
    // then check if user is authenticated
    // then check if user is verified
    // then generate keyword from content with gemini ai
    // then create note
    // then return note
    const { title, content, tags } = req.body;

    if (!title || !content || !tags) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ error: "User doesn't exist" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ error: "User is not verified" });
    }
    const keywords = await generateKeywords(content);
    const summary = await generateSummary(content);
    const note = await Note.create({
      user: user._id,
      title,
      content,
      tags,
      keywords,
      summary,
    });

    return res.status(200).json({
      success: true,
      message: "Note created successfully",
      note: note,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes: notes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      note: note,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      note: note,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { content, title, tags } = req.body;

    if (!content || !title) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
        error: "Please fill all the fields",
      });
    }
    const note = await Note.findById(req.params.id);
    note.content = content;
    note.title = title;
    note.tags = tags;
    const keywords = await generateKeywords(content);
    note.keywords = keywords;
    const summary = await generateSummary(content);
    note.summary = summary;
    await note.save();
    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: note,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid search query",
        error: "Missing query",
      });
    }

    const escapeRegex = (text) =>
      text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const safeQuery = escapeRegex(query);
    console.log(safeQuery);
    
    const notes = await Note.find({
      $or: [
        { title: { $regex: safeQuery, $options: "i" } },
        { tags: { $elemMatch: { $regex: safeQuery, $options: "i" } } },
        { keywords: { $elemMatch: { $regex: safeQuery, $options: "i" } } },
      ],
    }).sort({ createdAt: -1 })
    

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes: notes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getNotesByTag = async (req, res) => {
  try {
    const notes = await Note.find({ tags: req.params.tag }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes: notes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const generateTitle = async ( req , res)=>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Note not found",
                error: "Note not found",
            });
        }
        const note = await Note.findById(id);
        if(!note || !note.content){
            return res.status(400).json({
                success: false,
                message: "Note not found",
                error: "Note not found",
            });
        }
        const content = note.content;
        const title = await suggestTitle(content);
        note.title = title;
        await note.save();
        return res.status(200).json({
            success: true,
            message: "Title generated successfully",
            title: title
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
}

export const improveContentController = async ( req , res) =>{
  try {
    const {content } = req.body;
    const improvedContent = await improveContent(content);
    return res.status(200).json({
        success: true,
        message: "Content improved successfully",
        content: improvedContent
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
    });
  }
}

export const generateContent = async (req , res)=>{
  try {
    const {topic} = req.body;
    const content = await genContent(topic);
    return res.status(200).json({
        success: true,
        message: "Content generated successfully",
        content: content
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
    });
  }
}

export const chatWithNote = async (req, res) => {
     try {
        const { id } = req.params;
        const { message, sessionId } = req.body;
        const userId = req.user.id;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }
        
        // Get the note and verify ownership
        const note = await Note.findOne({ _id: id, user: userId });
        if (!note) {
            return res.status(404).json({
                success: false,
                error: 'Note not found or unauthorized'
            });
        }
        
        // Create note context with title and content
        const noteContext = `Title: ${note.title}\nContent: ${note.content}${note.summary ? '\nSummary: ' + note.summary : ''}`;
        
        const result = await chatWithNoteAI(id, userId, message, sessionId, noteContext);
        
        res.json({
            success: true,
            response: result.response,
            sessionId: result.sessionId,
            conversationId: result.conversationId
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process chat message'
        });
    }
};

// Get conversation history for a note
export const getConversationHistoryController = async (req, res) => {
    try {
        const { id } = req.params; // noteId
        const { sessionId } = req.query;
        const userId = req.user.id;

        // Verify note ownership
        const note = await Note.findOne({ _id: id, user: userId });
        if (!note) {
            return res.status(404).json({
                success: false,
                error: 'Note not found or unauthorized'
            });
        }

        const conversations = await getConversationHistory(userId, id, sessionId);
        
        res.json({
            success: true,
            conversations: conversations
        });
    } catch (error) {
        console.error('Error fetching conversation history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch conversation history'
        });
    }
};

// Clear a conversation (mark as inactive)
export const clearConversationController = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;

        const success = await clearConversation(sessionId, userId);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        res.json({
            success: true,
            message: 'Conversation cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing conversation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear conversation'
        });
    }
};

// Delete a conversation permanently
export const deleteConversationController = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;

        const success = await deleteConversation(sessionId, userId);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        res.json({
            success: true,
            message: 'Conversation deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete conversation'
        });
    }
};