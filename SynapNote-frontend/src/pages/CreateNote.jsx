import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotes } from '../context/NotesContext';
import { 
  Save, 
  ArrowLeft, 
  Wand2, 
  Sparkles, 
  Plus,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

function CreateNote() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState({
    content: false,
    improve: false
  });
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [topic, setTopic] = useState('');
  
  const { createNote, generateContent, improveContent } = useNotes();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleGenerateContent = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setAiLoading({ ...aiLoading, content: true });
    
    const result = await generateContent(topic);
    
    if (result.success) {
      setFormData({
        ...formData,
        content: result.content,
        title: formData.title || `Notes on ${topic}`
      });
      setShowTopicInput(false);
      setTopic('');
      toast.success('Content generated successfully!');
    }
    
    setAiLoading({ ...aiLoading, content: false });
  };

  const handleImproveContent = async () => {
    if (!formData.content.trim()) {
      toast.error('Please enter some content to improve');
      return;
    }

    setAiLoading({ ...aiLoading, improve: true });
    
    const result = await improveContent(formData.content);
    
    if (result.success) {
      setFormData({
        ...formData,
        content: result.content
      });
      toast.success('Content improved successfully!');
    }
    
    setAiLoading({ ...aiLoading, improve: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setLoading(true);
    
    const result = await createNote(formData);
    
    if (result.success) {
      navigate(`/notes/${result.note._id}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/notes')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Note</h1>
            <p className="text-gray-600">Write your thoughts with AI assistance</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary flex items-center space-x-2"
        >
          {loading ? (
            <div className="loading-spinner" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>Save Note</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Title */}
            <div className="card p-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="input-field text-xl font-semibold"
                placeholder="Enter your note title..."
              />
            </div>

            {/* Content */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowTopicInput(!showTopicInput)}
                    className="btn-secondary text-sm flex items-center space-x-1"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Generate</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleImproveContent}
                    disabled={aiLoading.improve || !formData.content.trim()}
                    className="btn-secondary text-sm flex items-center space-x-1 disabled:opacity-50"
                  >
                    {aiLoading.improve ? (
                      <div className="loading-spinner w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>Improve</span>
                  </button>
                </div>
              </div>

              {/* Topic Input for Generation */}
              {showTopicInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Enter a topic to generate content about..."
                      className="flex-1 input-field"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateContent}
                      disabled={aiLoading.content || !topic.trim()}
                      className="btn-primary flex items-center space-x-1 disabled:opacity-50"
                    >
                      {aiLoading.content ? (
                        <div className="loading-spinner w-4 h-4" />
                      ) : (
                        <Wand2 className="w-4 h-4" />
                      )}
                      <span>Generate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTopicInput(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </motion.div>
              )}

              <textarea
                id="content"
                name="content"
                required
                rows={16}
                value={formData.content}
                onChange={handleChange}
                className="input-field resize-none"
                placeholder="Start writing your note... Use AI tools above to generate or improve content."
              />
            </div>
          </motion.form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Tags */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              
              <form onSubmit={addTag} className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Add a tag..."
                />
                <button
                  type="submit"
                  className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-primary-500 hover:text-primary-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* AI Features Info */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Features</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wand2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-Generation</h4>
                    <p className="text-sm text-gray-600">Generate content from any topic</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Content Improvement</h4>
                    <p className="text-sm text-gray-600">Enhance your writing with AI</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Save className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Smart Organization</h4>
                    <p className="text-sm text-gray-600">Auto-generated keywords & summary</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CreateNote;