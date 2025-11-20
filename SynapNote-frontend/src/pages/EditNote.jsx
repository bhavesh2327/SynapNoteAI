import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotes } from '../context/NotesContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Save, 
  ArrowLeft, 
  Sparkles, 
  Plus,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNote, fetchNote, updateNote, improveContent, loading } = useNotes();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [improving, setImproving] = useState(false);

  useEffect(() => {
    fetchNote(id);
  }, [id]);

  useEffect(() => {
    if (currentNote) {
      setFormData({
        title: currentNote.title || '',
        content: currentNote.content || '',
        tags: currentNote.tags || []
      });
    }
  }, [currentNote]);

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

  const handleImproveContent = async () => {
    if (!formData.content.trim()) {
      toast.error('Please enter some content to improve');
      return;
    }

    setImproving(true);
    
    const result = await improveContent(formData.content);
    
    if (result.success) {
      setFormData({
        ...formData,
        content: result.content
      });
      toast.success('Content improved successfully!');
    }
    
    setImproving(false);
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

    setSaving(true);
    
    const result = await updateNote(id, formData);
    
    if (result.success) {
      navigate(`/notes/${id}`);
    }
    
    setSaving(false);
  };

  if (loading) {
    return <LoadingSpinner text="Loading note..." />;
  }

  if (!currentNote) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Note not found</h2>
          <button onClick={() => navigate('/notes')} className="btn-primary">
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate(`/notes/${id}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Note</h1>
            <p className="text-gray-600">Update your note with AI assistance</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary flex items-center space-x-2"
        >
          {saving ? (
            <div className="loading-spinner" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>Save Changes</span>
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
                <button
                  type="button"
                  onClick={handleImproveContent}
                  disabled={improving || !formData.content.trim()}
                  className="btn-secondary text-sm flex items-center space-x-1 disabled:opacity-50"
                >
                  {improving ? (
                    <div className="loading-spinner w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Improve Content</span>
                </button>
              </div>

              <textarea
                id="content"
                name="content"
                required
                rows={16}
                value={formData.content}
                onChange={handleChange}
                className="input-field resize-none"
                placeholder="Write your note content..."
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

            {/* Note Info */}
            {currentNote && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Note Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Created:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(currentNote.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Last Updated:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(currentNote.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Keywords */}
            {currentNote?.keywords && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {currentNote.keywords.map(keyword => (
                    <span
                      key={keyword}
                      className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default EditNote;