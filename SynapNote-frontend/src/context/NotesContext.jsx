import { createContext, useContext, useReducer } from 'react';
import { notesAPI } from '../services/api';
import toast from 'react-hot-toast';

const NotesContext = createContext();

const initialState = {
  notes: [],
  currentNote: null,
  loading: false,
  searchQuery: '',
  selectedTag: null
};

function notesReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_CURRENT_NOTE':
      return { ...state, currentNote: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note => 
          note.id === action.payload.id ? action.payload : note
        ),
        currentNote: action.payload
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload)
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_TAG':
      return { ...state, selectedTag: action.payload };
    default:
      return state;
  }
}

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  const fetchNotes = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await notesAPI.getAllNotes();      
      if (response.data.success) {
        dispatch({ type: 'SET_NOTES', payload: response.data.notes });
      }
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchNote = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      console.log("Fetching note with ID:", id);
      
      const response = await notesAPI.getNote(id);
      if (response.data.success) {
        dispatch({ type: 'SET_CURRENT_NOTE', payload: response.data.note });
      }
    } catch (error) {
      toast.error('Failed to fetch note');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createNote = async (noteData) => {
    try {
      const response = await notesAPI.createNote(noteData);
      if (response.data.success) {
        dispatch({ type: 'ADD_NOTE', payload: response.data.note });
        toast.success('Note created successfully!');
        return { success: true, note: response.data.note };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create note';
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      const response = await notesAPI.updateNote(id, noteData);
      if (response.data.success) {
        dispatch({ type: 'UPDATE_NOTE', payload: response.data.note });
        toast.success('Note updated successfully!');
        return { success: true, note: response.data.note };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update note';
      toast.error(message);
      return { success: false, message };
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await notesAPI.deleteNote(id);
      if (response.data.success) {
        dispatch({ type: 'DELETE_NOTE', payload: id });
        toast.success('Note deleted successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete note';
      toast.error(message);
      return { success: false, message };
    }
  };

  const searchNotes = async (query) => {
    if (query.length < 3) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await notesAPI.searchNotes(query);
      if (response.data.success) {
        dispatch({ type: 'SET_NOTES', payload: response.data.notes });
        dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
      }
    } catch (error) {
      toast.error('Failed to search notes');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getNotesByTag = async (tag) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await notesAPI.getNotesByTag(tag);
      if (response.data.success) {
        dispatch({ type: 'SET_NOTES', payload: response.data.notes });
        dispatch({ type: 'SET_SELECTED_TAG', payload: tag });
      }
    } catch (error) {
      toast.error('Failed to fetch notes by tag');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const generateTitle = async (noteId) => {
    try {
      const response = await notesAPI.generateTitle(noteId);
      if (response.data.success) {
        return { success: true, title: response.data.title };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate title';
      toast.error(message);
      return { success: false, message };
    }
  };

  const generateContent = async (topic) => {
    try {
      const response = await notesAPI.generateContent(topic);
      if (response.data.success) {
        return { success: true, content: response.data.content };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate content';
      toast.error(message);
      return { success: false, message };
    }
  };

  const improveContent = async (content) => {
    try {
      const response = await notesAPI.improveContent(content);
      if (response.data.success) {
        return { success: true, content: response.data.content };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to improve content';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    ...state,
    fetchNotes,
    fetchNote,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    getNotesByTag,
    generateTitle,
    generateContent,
    improveContent
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};