import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import FileUpload from './FileUpload';
import FileList from './FileList';
import Pagination from './Pagination';
import FolderManager from './FolderManager';
import TrashManager from './TrashManager';
import SearchBar from './SearchBar'; 
import { API_URL } from "../lib/config";


export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });
  const [currentFolder, setCurrentFolder] = useState('root');
  const [showTrash, setShowTrash] = useState(false);

  // ✅ Responsive sidebar toggle
  const [showMobileFolders, setShowMobileFolders] = useState(false);

  // ✅ Search results (null = no search active)
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [pagination.page, currentFolder]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const token = (await supabase.auth.getSession()).data.session?.access_token;

      let url = `${API_URL}/files?page=${pagination.page}&limit=${pagination.limit}`;
if (currentFolder) {
  url += `&folder_id=${currentFolder}`;
}


      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      setFiles(data.files);
      setPagination((prev) => ({ ...prev, ...data.pagination }));
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleFolderChange = (folderId) => {
    setCurrentFolder(folderId);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading files...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Guptify
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTrash(true)}
              className="text-sm text-gray-700 hover:text-gray-900 px-2 py-1"
            >
              🗑️ Trash
            </button>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-700 hover:text-gray-900 px-2 py-1"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex flex-col md:flex-row">
          {/* Mobile folder toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowMobileFolders(!showMobileFolders)}
              className="w-full bg-indigo-600 text-white py-2 rounded-md flex items-center justify-center"
            >
              {showMobileFolders ? 'Hide Folders' : 'Show Folders'}
              <span className="ml-2">{showMobileFolders ? '↑' : '↓'}</span>
            </button>
          </div>

          {/* Sidebar (hidden on mobile unless toggled) */}
          <div
            className={`${
              showMobileFolders ? 'block' : 'hidden'
            } md:block w-full md:w-64 mb-6 md:mb-0 md:mr-8`}
          >
            <FolderManager
              currentFolder={currentFolder}
              onFolderChange={handleFolderChange}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* ✅ Updated SearchBar usage */}
            <SearchBar
              onSearchResults={setSearchResults}
              onClearSearch={() => setSearchResults(null)}
            />

            {searchResults ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Search Results</h2>
                  <button
                    onClick={() => setSearchResults(null)}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Clear Search
                  </button>
                </div>
                <FileList files={searchResults} onUpdate={fetchFiles} />
              </>
            ) : (
              <>
                <FileUpload
                  onUpload={fetchFiles}
                  currentFolder={currentFolder}
                />
                <FileList files={files} onUpdate={fetchFiles} />
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Trash modal */}
      <TrashManager isOpen={showTrash} onClose={() => setShowTrash(false)} />
    </div>
  );
}
