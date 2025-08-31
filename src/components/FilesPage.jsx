import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { API_URL } from '../lib/config';
import FileUpload from './FileUpload';
import FileList from './FileList';
import Pagination from './Pagination';
import SearchBar from './SearchBar';

export default function FilesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });
  const [currentFolder, setCurrentFolder] = useState('root');
  const [searchResults, setSearchResults] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [pagination.page, currentFolder]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const token = (await supabase.auth.getSession()).data.session?.access_token;

      let url = `${API_URL}/files?page=${pagination.page}&limit=${pagination.limit}`;
      if (currentFolder && currentFolder !== 'root') {
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
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFileUpload = () => {
    setShowUpload(true);
  };

  const handleUploadClose = () => {
    setShowUpload(false);
    fetchFiles(); // Refresh files after upload
  };

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const handleClearSearch = () => {
    setSearchResults(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-spin">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-xl font-semibold text-purple-900 mb-2">Loading Files...</h2>
          <p className="text-purple-600">Getting your files ready...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">📁 My Files</h1>
          <p className="text-purple-600 text-lg">
            Manage and organize all your uploaded files
          </p>
        </div>

        {/* Search and Upload Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 mb-8 slide-up">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
            </div>
            <button
              onClick={handleFileUpload}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span className="text-xl">📤</span>
              <span>Upload Files</span>
            </button>
          </div>
        </div>

        {/* Folder Navigation */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 mb-8 slide-up">
          <h2 className="text-xl font-bold text-purple-900 mb-4">📂 Current Location</h2>
          <div className="flex items-center space-x-2 text-purple-600">
            <span>🏠</span>
            <span className="font-medium">Home</span>
            {currentFolder !== 'root' && (
              <>
                <span>→</span>
                <span className="font-medium">Folder Name</span>
              </>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => handleFolderChange('root')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentFolder === 'root'
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
            >
              🏠 Root
            </button>
            {/* Add more folder buttons here when you have folder functionality */}
          </div>
        </div>

        {/* Files Display */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-purple-900">
              {searchResults ? '🔍 Search Results' : '📄 Files'}
            </h2>
            <div className="text-purple-600">
              {searchResults ? `${searchResults.length} results` : `${pagination.total} total files`}
            </div>
          </div>

          {searchResults ? (
            <FileList 
              files={searchResults} 
              onRefresh={fetchFiles}
              showActions={true}
            />
          ) : (
            <>
              <FileList 
                files={files} 
                onRefresh={fetchFiles}
                showActions={true}
              />
              
              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination 
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}

          {files.length === 0 && !searchResults && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">No files yet</h3>
              <p className="text-purple-600 mb-6">
                Start by uploading your first file to your secret cloud space!
              </p>
              <button
                onClick={handleFileUpload}
                className="px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transform hover:scale-105 transition-all duration-300"
              >
                📤 Upload Your First File
              </button>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-purple-900">📤 Upload Files</h2>
                <button
                  onClick={handleUploadClose}
                  className="text-purple-600 hover:text-purple-800 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <FileUpload onUploadComplete={handleUploadClose} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}