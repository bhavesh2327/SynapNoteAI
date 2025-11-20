import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { 
  BookOpen, 
  Plus, 
  Search, 
  TrendingUp, 
  Clock,
  Tag,
  Brain,
  MessageCircle
} from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();
  const { notes, fetchNotes, loading } = useNotes();
  const [stats, setStats] = useState({
    totalNotes: 0,
    recentNotes: 0,
    totalTags: 0,
    totalWords: 0
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      const recentCount = notes.filter(note => {
        const noteDate = new Date(note.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return noteDate > weekAgo;
      }).length;

      const allTags = new Set();
      let totalWords = 0;
      
      notes.forEach(note => {
        if (note.tags) {
          note.tags.forEach(tag => allTags.add(tag));
        }
        if (note.content) {
          totalWords += note.content.split(' ').length;
        }
      });

      setStats({
        totalNotes: notes.length,
        recentNotes: recentCount,
        totalTags: allTags.size,
        totalWords
      });
    }
  }, [notes]);

  const recentNotes = notes.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 text-lg">
          Here's what's happening with your notes today.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <Link
          to="/notes/new"
          className="card p-6 hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Create Note</h3>
              <p className="text-sm text-gray-600">Start a new intelligent note</p>
            </div>
          </div>
        </Link>

        <Link
          to="/notes"
          className="card p-6 hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Search Notes</h3>
              <p className="text-sm text-gray-600">Find any note instantly</p>
            </div>
          </div>
        </Link>

        <div className="card p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-600">Get AI-powered insights</p>
            </div>
          </div>
        </div>
      </motion.div>



      {/* Recent Notes */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Notes</h2>
          <Link
            to="/notes"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="loading-spinner" />
          </div>
        ) : recentNotes.length > 0 ? (
          <div className="space-y-4">
            {recentNotes.map((note, index) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {note.summary || note.content?.substring(0, 100) + '...'}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    {note.tags?.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
                <Link
                  to={`/notes/${note._id}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <MessageCircle className="w-5 h-5" />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
              <p className="text-gray-600 mb-6">
              Create your first note to get started with SynapNote
            </p>
            <Link to="/notes/new" className="btn-primary">
              Create Your First Note
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Dashboard;