import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { API_URL } from '../lib/config';

export default function FoldersPage() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [currentFolder, setCurrentFolder] = useState('root');

  useEffect(() => {
    fetchFolders();
  }, [currentFolder]);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since folder API might not be implemented
      // You can replace this with actual API calls when ready
      const mockFolders = [
        { id: '1', name: 'Work Documents', fileCount: 12, created: '2024-01-15', color: 'purple' },
        { id: '2', name: 'Personal Photos', fileCount: 45, created: '2024-01-10', color: 'blue' },
        { id: '3', name: 'School Projects', fileCount: 8, created: '2024-01-05', color: 'green' },
        { id: '4', name: 'Music Collection', fileCount: 23, created: '2024-01-01', color: 'pink' }
      ];
      
      setFolders(mockFolders);
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      // Mock folder creation - replace with actual API call
      const newFolder = {
        id: Date.now().toString(),
        name: newFolderName,
        fileCount: 0,
        created: new Date().toISOString().split('T')[0],
        color: ['purple', 'blue', 'green', 'pink', 'indigo'][Math.floor(Math.random() * 5)]
      };
      
      setFolders(prev => [newFolder, ...prev]);
      setNewFolderName('');
      setShowCreateFolder(false);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (window.confirm('Are you sure you want to delete this folder? All files inside will be moved to trash.')) {
      try {
        // Mock folder deletion - replace with actual API call
        setFolders(prev => prev.filter(f => f.id !== folderId));
      } catch (error) {
        console.error('Error deleting folder:', error);
      }
    }
  };

  const getFolderIcon = (color) => {
    const icons = {
      purple: '📁',
      blue: '📂',
      green: '🗂️',
      pink: '📋',
      indigo: '📚'
    };
    return icons[color] || '📁';
  };

  const getFolderColor = (color) => {
    const colors = {
      purple: 'from-purple-500 to-purple-600',
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      pink: 'from-pink-500 to-pink-600',
      indigo: 'from-indigo-500 to-indigo-600'
    };
    return colors[color] || 'from-purple-500 to-purple-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-spin">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-xl font-semibold text-purple-900 mb-2">Loading Folders...</h2>
          <p className="text-purple-600">Getting your folders ready...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">📂 Folders</h1>
          <p className="text-purple-600 text-lg">
            Organize your files into neat, organized folders
          </p>
        </div>

        {/* Create Folder Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 mb-8 slide-up">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-purple-900 mb-2">Create New Folder</h2>
              <p className="text-purple-600">
                Keep your files organized by creating folders for different projects or categories
              </p>
            </div>
            <button
              onClick={() => setShowCreateFolder(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span className="text-xl">➕</span>
              <span>New Folder</span>
            </button>
          </div>
        </div>

        {/* Folder Navigation */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 mb-8 slide-up">
          <h2 className="text-xl font-bold text-purple-900 mb-4">📍 Current Location</h2>
          <div className="flex items-center space-x-2 text-purple-600">
            <span>🏠</span>
            <span className="font-medium">Home</span>
            {currentFolder !== 'root' && (
              <>
                <span>→</span>
                <span className="font-medium">Current Folder</span>
              </>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentFolder('root')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentFolder === 'root'
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
            >
              🏠 Root
            </button>
            {/* Add breadcrumb navigation here when you have nested folders */}
          </div>
        </div>

        {/* Folders Grid */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-purple-900">Your Folders</h2>
            <div className="text-purple-600">
              {folders.length} folder{folders.length !== 1 ? 's' : ''}
            </div>
          </div>

          {folders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 transform hover:scale-105 hover:shadow-xl card cursor-pointer"
                  onClick={() => setCurrentFolder(folder.id)}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${getFolderColor(folder.color)} rounded-2xl flex items-center justify-center text-white text-2xl mb-4 mx-auto`}>
                    {getFolderIcon(folder.color)}
                  </div>
                  
                  <h3 className="text-lg font-bold text-purple-900 mb-2 text-center">
                    {folder.name}
                  </h3>
                  
                  <div className="text-center text-purple-600 mb-4">
                    <p className="text-sm">{folder.fileCount} file{folder.fileCount !== 1 ? 's' : ''}</p>
                    <p className="text-xs">Created {folder.created}</p>
                  </div>
                  
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to folder
                      }}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                    >
                      Open
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">No folders yet</h3>
              <p className="text-purple-600 mb-6">
                Create your first folder to start organizing your files!
              </p>
              <button
                onClick={() => setShowCreateFolder(true)}
                className="px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transform hover:scale-105 transition-all duration-300"
              >
                ➕ Create Your First Folder
              </button>
            </div>
          )}
        </div>

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-purple-900">➕ Create New Folder</h2>
                <button
                  onClick={() => setShowCreateFolder(false)}
                  className="text-purple-600 hover:text-purple-800 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-purple-900 font-medium mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name..."
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateFolder(false)}
                  className="flex-1 px-4 py-3 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Folder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Folder Tips */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 mt-8 slide-up">
          <h3 className="text-xl font-bold text-purple-900 mb-4">💡 Folder Organization Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                1
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">Use Clear Names</h4>
                <p className="text-purple-600 text-sm">Name folders descriptively so you can find them easily</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                2
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">Group by Project</h4>
                <p className="text-purple-600 text-sm">Organize files by project or topic</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                3
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">Keep it Simple</h4>
                <p className="text-purple-600 text-sm">Don't create too many nested folders</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                4
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">Regular Cleanup</h4>
                <p className="text-purple-600 text-sm">Delete empty folders and organize regularly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}