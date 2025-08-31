import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { API_URL } from '../lib/config';

export default function FolderManager({ currentFolder, onFolderChange }) {
  const [folders, setFolders] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/folders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFolders(data.folders);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const createFolder = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/folders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newFolderName,
          parent_id: currentFolder === 'root' ? null : currentFolder
        })
      });

      if (response.ok) {
        setNewFolderName('');
        setShowCreateForm(false);
        fetchFolders();
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">📂 My Folders</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
          >
            <span className="mr-1">+</span>
            New
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name..."
              className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={createFolder}
                disabled={!newFolderName.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Create Folder
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewFolderName('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={() => onFolderChange('root')}
            className={`w-full text-left p-3 rounded-md transition-colors duration-200 flex items-center ${
              currentFolder === 'root' 
                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className="mr-2">🏠</span>
            <span className="font-medium">Home</span>
          </button>
          
          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => onFolderChange(folder.id)}
              className={`w-full text-left p-3 rounded-md transition-colors duration-200 flex items-center ${
                currentFolder === folder.id 
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="mr-2">📁</span>
              <span className="font-medium">{folder.name}</span>
            </button>
          ))}
          
          {folders.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <div className="text-2xl mb-2">📂</div>
              <p className="text-sm">No folders yet</p>
              <p className="text-xs">Create your first folder to organize files</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}