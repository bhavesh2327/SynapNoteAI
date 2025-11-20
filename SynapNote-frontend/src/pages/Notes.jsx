import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotes } from '../context/NotesContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search, 
  Plus, 
  BookOpen, 
  Calendar, 
  Tag,
  Filter,
  Grid,
  List
} from 'lucide-react';
import toast from 'react-hot-toast';

function Notes() {
  const { 
    notes, 
    fetchNotes, 
    searchNotes, 
    getNotesByTag, 
    loading, 
    searchQuery, 
    selectedTag 
  } = useNotes();
  
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearchQuery.length >= 3) {
      searchNotes(localSearchQuery);
    } else if (localSearchQuery === '') {
      fetchNotes();
    }
    else if(localSearchQuery.length < 3){
      toast.error('Search query must be at least 3 characters');
    }
  };

  const handleTagFilter = (tag) => {
    if (selectedTag === tag) {
      fetchNotes();
    } else {
      getNotesByTag(tag);
    }
    setFilterOpen(false);
  };

  const getAllTags = () => {
    const allTags = new Set();
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => allTags.add(tag));
      }
    });
    return Array.from(allTags);
  };

  const sortedNotes = [...notes].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Notes</h1>
          <p className="text-gray-600">
            {searchQuery ? `Search results for "${searchQuery}"` : 
             selectedTag ? `Notes tagged with "${selectedTag}"` :
             `${notes.length} notes total`}
          </p>
        </div>
        
        <Link
          to="/notes/new"
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5" />
          <span>New Note</span>
        </Link>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="card p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="input-field pl-11 pr-4 rounded-r-none"
                />
              </div>
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-r-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field py-2 px-3 text-sm"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`btn-secondary flex items-center space-x-2 ${
                selectedTag ? 'bg-primary-50 border-primary-300 text-primary-700' : ''
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  fetchNotes();
                  setFilterOpen(false);
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                  !selectedTag
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Notes
              </button>
              {getAllTags().map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagFilter(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                    selectedTag === tag
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Notes Grid/List */}
      {loading ? (
        <LoadingSpinner text="Loading notes..." />
      ) : sortedNotes.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }
        >
          {sortedNotes.map((note, index) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link to={`/notes/${note._id}`}>
                <div className={`note-card ${viewMode === 'list' ? 'flex items-center space-x-4' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {note.title}
                      </h3>
                      {viewMode === 'grid' && (
                        <BookOpen className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {note.summary || note.content?.substring(0, 150) + '...'}
                    </p>
                    
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {note.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                        {note.tags.length > 3 && (
                          <span className="text-gray-400 text-xs">
                            +{note.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                        </div>
                        {note.keywords && (
                          <div className="flex items-center space-x-1">
                            <Tag className="w-4 h-4" />
                            <span>{note.keywords.length} keywords</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {viewMode === 'list' && (
                    <BookOpen className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center py-16"
        >
          <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            {searchQuery || selectedTag ? 'No matching notes found' : 'No notes yet'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery || selectedTag 
                ? 'Try adjusting your search terms or removing filters.'
                : 'Create your first note to get started with SynapNote.' 
            }
          </p>
          
          <div className="space-x-4">
            {(searchQuery || selectedTag) && (
              <button
                onClick={() => {
                  setLocalSearchQuery('');
                  fetchNotes();
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            )}
            <Link to="/notes/new" className="btn-primary">
              Create Note
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Notes;