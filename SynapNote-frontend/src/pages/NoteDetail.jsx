import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useNotes } from '../context/NotesContext';
import { chatAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import remarkGfm from 'remark-gfm';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MessageCircle, 
  Send,
  Calendar,
  Tag,
  Brain,
  Wand2
} from 'lucide-react';
import toast from 'react-hot-toast';

function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNote, fetchNote, deleteNote, generateTitle, loading } = useNotes();
  
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [titleGenerating, setTitleGenerating] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Custom code component for ReactMarkdown
  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    
    return !inline && language ? (
      <div className="relative">
        <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 rounded-t-lg text-sm">
          <span className="font-medium">{language}</span>
        </div>
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          className="rounded-t-none"
          customStyle={{
            margin: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  };

  // Custom components for ReactMarkdown
  const markdownComponents = {
    code: CodeBlock,
  };

  useEffect(() => {
    fetchNote(id);
    fetchChatHistory();
  }, [id]);

  const fetchChatHistory = async () => {
    try {
      const response = await chatAPI.getConversationHistory(id);
      if (response.data.success && response.data.conversations.length > 0) {
        const conversation = response.data.conversations[0];
        setChatHistory(conversation.messages);
        setSessionId(conversation.sessionId);
      }
    } catch (error) {
      // No existing chat history
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const result = await deleteNote(id);
      if (result.success) {
        navigate('/notes');
      }
    }
  };

  const handleGenerateTitle = async () => {
    setTitleGenerating(true);
    const result = await generateTitle(id);
    if (result.success) {
      // Refresh the note to get the updated title
      fetchNote(id);
      toast.success('Title generated successfully!');
    }
    setTitleGenerating(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMessage = { role: 'user', content: chatMessage, timestamp: new Date().toISOString() };
    setChatHistory(prev => [...prev, userMessage]);
    setChatLoading(true);
    
    try {
      const response = await chatAPI.chatWithNote(id, {
        message: chatMessage,
        sessionId: sessionId
      });
      
      if (response.data.success) {
        const aiMessage = { 
          role: 'assistant', 
          content: response.data.response, 
          timestamp: new Date().toISOString() 
        };
        setChatHistory(prev => [...prev, aiMessage]);
        setSessionId(response.data.sessionId);
        setChatMessage('');
      }
    } catch (error) {
      toast.error('Failed to send message');
      // Remove the user message if the API call failed
      setChatHistory(prev => prev.slice(0, -1));
    } finally {
      setChatLoading(false);
    }
  };

  const clearChat = async () => {
    if (sessionId) {
      try {
        await chatAPI.clearConversation(sessionId);
        setChatHistory([]);
        setSessionId(null);
        setShowClearConfirm(false);
        toast.success('Chat cleared');
      } catch (error) {
        toast.error('Failed to clear chat');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading note..." />;
  }

  if (!currentNote) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Note not found</h2>
          <Link to="/notes" className="btn-primary">
            Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-6"
          >
            <button
              onClick={() => navigate('/notes')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Notes</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleGenerateTitle}
                disabled={titleGenerating}
                className="btn-secondary flex items-center space-x-1 disabled:opacity-50"
              >
                {titleGenerating ? (
                  <div className="loading-spinner w-4 h-4" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                <span>Generate Title</span>
              </button>
              
              <Link
                to={`/notes/${id}/edit`}
                className="btn-secondary flex items-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Link>

              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Note Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card p-8 mb-6"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {currentNote.title}
            </h1>
            
            <div className="prose max-w-none">
              <ReactMarkdown 
                rehypePlugins={[remarkGfm]} 
                components={markdownComponents}
              >
                {currentNote.content}
              </ReactMarkdown>
            </div>
          </motion.div>

          {/* AI Summary */}
          {currentNote.summary && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-6 mb-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Summary</h3>
              </div>
              <ReactMarkdown 
                rehypePlugins={[remarkGfm]} 
                components={markdownComponents}
              >
                {currentNote.summary}
              </ReactMarkdown>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Note Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Note Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">
                      {new Date(currentNote.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-600">
                      {new Date(currentNote.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Tag className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {currentNote.tags && currentNote.tags.length > 0 ? (
                        currentNote.tags.map(tag => (
                          <span
                            key={tag}
                            className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No tags</span>
                      )}
                    </div>
                  </div>
                </div>

                {currentNote.keywords && (
                  <div className="flex items-start space-x-3">
                    <Brain className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-2">AI Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {currentNote.keywords.map(keyword => (
                          <span
                            key={keyword}
                            className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Chat Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Chat with AI</h3>
                </div>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="btn-secondary text-sm"
                >
                  {showChat ? 'Hide' : 'Show'}
                </button>
              </div>

              {showChat && (
                <div className="space-y-4">
                  {/* Chat History */}
                  <div className="max-h-64 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-lg">
                    {chatHistory.length === 0 ? (
                      <p className="text-center text-gray-500 text-sm">
                        Start a conversation about this note
                      </p>
                    ) : (
                      chatHistory.map((message, index) => (
                        <div
                          key={index}
                          className={`chat-message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                        >
                          <ReactMarkdown components={markdownComponents}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ))
                    )}
                    
                    {chatLoading && (
                      <div className="ai-message">
                        <div className="flex items-center space-x-2">
                          <div className="loading-spinner w-4 h-4" />
                          <span className="text-sm text-gray-600">AI is thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask about this note..."
                      className="flex-1 input-field py-2 text-sm"
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatMessage.trim()}
                      className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Chat Actions */}
                  {chatHistory.length > 0 && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        {chatHistory.length} messages
                      </span>
                      {!showClearConfirm ? (
                        <button
                          onClick={() => setShowClearConfirm(true)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Clear Chat
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600">Sure?</span>
                          <button
                            onClick={clearChat}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setShowClearConfirm(false)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            No
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteDetail;