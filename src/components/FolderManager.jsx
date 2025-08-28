import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
      const response = await fetch('http://localhost:3001/folders', {
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
      const response = await fetch('http://localhost:3001/folders', {
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Folders</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
        >
          New Folder
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="w-full p-2 border rounded mb-2"
          />
          <div className="flex space-x-2">
            <button
              onClick={createFolder}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1">
        <button
          onClick={() => onFolderChange('root')}
          className={`w-full text-left p-2 rounded ${
            currentFolder === 'root' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'
          }`}
        >
          📁 Root Folder
        </button>
        
        {folders.map(folder => (
          <button
            key={folder.id}
            onClick={() => onFolderChange(folder.id)}
            className={`w-full text-left p-2 rounded ${
              currentFolder === folder.id ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'
            }`}
          >
            📁 {folder.name}
          </button>
        ))}
      </div>
    </div>
  );
}