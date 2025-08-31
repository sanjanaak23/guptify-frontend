import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { API_URL } from '../lib/config';

export default function TrashPage() {
  const [trashItems, setTrashItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchTrashItems();
  }, []);

  const fetchTrashItems = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since trash API might not be implemented
      // You can replace this with actual API calls when ready
      const mockTrashItems = [
        { id: '1', name: 'old_report.pdf', type: 'pdf', size: '2.5 MB', deleted: '2024-01-20', originalPath: '/Work Documents' },
        { id: '2', name: 'vacation_photo.jpg', type: 'image', size: '1.8 MB', deleted: '2024-01-19', originalPath: '/Personal Photos' },
        { id: '3', name: 'project_notes.txt', type: 'text', size: '0.1 MB', deleted: '2024-01-18', originalPath: '/School Projects' },
        { id: '4', name: 'song.mp3', type: 'audio', size: '4.2 MB', deleted: '2024-01-17', originalPath: '/Music Collection' }
      ];
      
      setTrashItems(mockTrashItems);
    } catch (error) {
      console.error('Error fetching trash items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (itemId) => {
    try {
      // Mock restore - replace with actual API call
      setTrashItems(prev => prev.filter(item => item.id !== itemId));
      // You can add a success message here
    } catch (error) {
      console.error('Error restoring item:', error);
    }
  };

  const handlePermanentDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to permanently delete this item? This action cannot be undone.')) {
      try {
        // Mock permanent deletion - replace with actual API call
        setTrashItems(prev => prev.filter(item => item.id !== itemId));
        // You can add a success message here
      } catch (error) {
        console.error('Error permanently deleting item:', error);
      }
    }
  };

  const handleRestoreSelected = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      // Mock restore selected - replace with actual API call
      setTrashItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      // You can add a success message here
    } catch (error) {
      console.error('Error restoring selected items:', error);
    }
  };

  const handleEmptyTrash = async () => {
    if (window.confirm('Are you sure you want to empty the trash? This will permanently delete all items and cannot be undone.')) {
      try {
        // Mock empty trash - replace with actual API call
        setTrashItems([]);
        setSelectedItems([]);
        // You can add a success message here
      } catch (error) {
        console.error('Error emptying trash:', error);
      }
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getFileIcon = (type) => {
    const icons = {
      pdf: '📕',
      image: '🖼️',
      text: '📄',
      audio: '🎵',
      video: '🎥',
      document: '📝',
      spreadsheet: '📊',
      presentation: '📽️'
    };
    return icons[type] || '📁';
  };

  const getFileTypeColor = (type) => {
    const colors = {
      pdf: 'from-red-500 to-red-600',
      image: 'from-green-500 to-green-600',
      text: 'from-blue-500 to-blue-600',
      audio: 'from-purple-500 to-purple-600',
      video: 'from-pink-500 to-pink-600',
      document: 'from-indigo-500 to-indigo-600',
      spreadsheet: 'from-yellow-500 to-yellow-600',
      presentation: 'from-orange-500 to-orange-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-spin">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-xl font-semibold text-purple-900 mb-2">Loading Trash...</h2>
          <p className="text-purple-600">Getting your deleted files ready...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">🗑️ Trash</h1>
          <p className="text-purple-600 text-lg">
            Recover deleted files or permanently remove them
          </p>
        </div>

        {/* Trash Stats and Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 mb-8 slide-up">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900">{trashItems.length}</div>
                <div className="text-purple-600 text-sm">Items in Trash</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900">
                  {trashItems.reduce((total, item) => total + parseFloat(item.size), 0).toFixed(1)} MB
                </div>
                <div className="text-purple-600 text-sm">Total Size</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {selectedItems.length > 0 && (
                <button
                  onClick={handleRestoreSelected}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <span>🔄</span>
                  <span>Restore Selected ({selectedItems.length})</span>
                </button>
              )}
              <button
                onClick={handleEmptyTrash}
                disabled={trashItems.length === 0}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <span>🗑️</span>
                <span>Empty Trash</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trash Items */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-purple-900">Deleted Items</h2>
            <div className="text-purple-600">
              {selectedItems.length} of {trashItems.length} selected
            </div>
          </div>

          {trashItems.length > 0 ? (
            <div className="space-y-4">
              {trashItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedItems.includes(item.id)
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-purple-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="w-5 h-5 text-purple-600 rounded border-purple-300 focus:ring-purple-500"
                    />
                    
                    <div className={`w-12 h-12 bg-gradient-to-br ${getFileTypeColor(item.type)} rounded-xl flex items-center justify-center text-white text-xl`}>
                      {getFileIcon(item.type)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-purple-900">{item.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-purple-600">
                        <span>Size: {item.size}</span>
                        <span>Deleted: {item.deleted}</span>
                        <span>From: {item.originalPath}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRestore(item.id)}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center space-x-1"
                      >
                        <span>🔄</span>
                        <span>Restore</span>
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(item.id)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center space-x-1"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🗑️</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Trash is empty</h3>
              <p className="text-purple-600">
                No deleted files to show. Files you delete will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Trash Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 mt-8 slide-up">
          <h3 className="text-xl font-bold text-purple-900 mb-4">ℹ️ About Trash</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">🔄 Restoring Files</h4>
              <p className="text-purple-600 text-sm">
                Restored files will be moved back to their original location. 
                If the original folder was deleted, files will be restored to the root folder.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">🗑️ Permanent Deletion</h4>
              <p className="text-purple-600 text-sm">
                Files permanently deleted from trash cannot be recovered. 
                Make sure you really want to delete them before proceeding.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">⏰ Auto-Cleanup</h4>
              <p className="text-purple-600 text-sm">
                Files in trash are automatically cleaned up after 30 days to save storage space. 
                Make sure to restore important files before then.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">💾 Storage</h4>
              <p className="text-purple-600 text-sm">
                Files in trash still count towards your storage quota. 
                Emptying trash will free up space for new files.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 mt-8 slide-up">
          <h3 className="text-xl font-bold text-purple-900 mb-4">🚀 Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-100 transition-all duration-300 text-left group">
              <div className="text-2xl mb-2">📁</div>
              <h4 className="font-semibold text-purple-900 group-hover:text-purple-700">View Files</h4>
              <p className="text-purple-600 text-sm">See all your active files</p>
            </button>
            
            <button className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-100 transition-all duration-300 text-left group">
              <div className="text-2xl mb-2">📂</div>
              <h4 className="font-semibold text-purple-900 group-hover:text-purple-700">Manage Folders</h4>
              <p className="text-purple-600 text-sm">Organize your file structure</p>
            </button>
            
            <button className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-100 transition-all duration-300 text-left group">
              <div className="text-2xl mb-2">🔍</div>
              <h4 className="font-semibold text-purple-900 group-hover:text-purple-700">Search Files</h4>
              <p className="text-purple-600 text-sm">Find files quickly</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}