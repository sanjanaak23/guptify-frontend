import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TrashManager({ isOpen, onClose }) {
  const [trashItems, setTrashItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTrash();
    }
  }, [isOpen]);

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch('http://localhost:3001/files/trash', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTrashItems(data.files);
      }
    } catch (error) {
      console.error('Error fetching trash:', error);
    } finally {
      setLoading(false);
    }
  };

  const restoreItem = async (itemId) => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`http://localhost:3001/files/${itemId}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchTrash(); // Refresh the list
      }
    } catch (error) {
      console.error('Error restoring item:', error);
    }
  };

  const deletePermanently = async (itemId) => {
    if (!window.confirm('Are you sure you want to permanently delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`http://localhost:3001/files/${itemId}/permanent`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchTrash(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting item permanently:', error);
    }
  };

  const emptyTrash = async () => {
    if (!window.confirm('Are you sure you want to empty the trash? This action cannot be undone.')) {
      return;
    }

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch('http://localhost:3001/files/trash/empty', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTrashItems([]);
        alert('Trash emptied successfully');
      }
    } catch (error) {
      console.error('Error emptying trash:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-96 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Trash</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-4">
          {loading ? (
            <div className="text-center py-8">Loading trash items...</div>
          ) : trashItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Trash is empty</div>
          ) : (
            <div className="space-y-2">
              {trashItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Deleted on {new Date(item.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => restoreItem(item.id)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => deletePermanently(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete Permanently
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {trashItems.length > 0 && (
          <div className="border-t pt-4">
            <button
              onClick={emptyTrash}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Empty Trash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}