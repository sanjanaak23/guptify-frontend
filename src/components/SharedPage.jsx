import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { API_URL } from '../lib/config';

export default function SharedPage() {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'

  useEffect(() => {
    fetchSharedFiles();
  }, [activeTab]);

  const fetchSharedFiles = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since shared files API might not be implemented
      // You can replace this with actual API calls when ready
      const mockSharedFiles = {
        received: [
          { id: '1', name: 'project_report.pdf', type: 'pdf', size: '3.2 MB', sharedBy: 'john@example.com', sharedAt: '2024-01-20', expiresAt: '2024-02-20' },
          { id: '2', name: 'team_photo.jpg', type: 'image', size: '2.1 MB', sharedBy: 'sarah@example.com', sharedAt: '2024-01-19', expiresAt: '2024-02-19' },
          { id: '3', name: 'meeting_notes.txt', type: 'text', size: '0.5 MB', sharedBy: 'mike@example.com', sharedAt: '2024-01-18', expiresAt: '2024-02-18' }
        ],
        sent: [
          { id: '4', name: 'presentation.pptx', type: 'presentation', size: '5.8 MB', sharedWith: 'team@company.com', sharedAt: '2024-01-20', expiresAt: '2024-02-20' },
          { id: '5', name: 'budget.xlsx', type: 'spreadsheet', size: '1.2 MB', sharedWith: 'finance@company.com', sharedAt: '2024-01-19', expiresAt: '2024-02-19' }
        ]
      };
      
      setSharedFiles(mockSharedFiles[activeTab] || []);
    } catch (error) {
      console.error('Error fetching shared files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId) => {
    try {
      // Mock download - replace with actual API call
      console.log(`Downloading file ${fileId}`);
      // You can add a success message here
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleRevokeAccess = async (fileId) => {
    if (window.confirm('Are you sure you want to revoke access to this file? The recipient will no longer be able to access it.')) {
      try {
        // Mock revoke access - replace with actual API call
        setSharedFiles(prev => prev.filter(file => file.id !== fileId));
        // You can add a success message here
      } catch (error) {
        console.error('Error revoking access:', error);
      }
    }
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

  const getDaysUntilExpiry = (expiresAt) => {
    const today = new Date();
    const expiryDate = new Date(expiresAt);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-spin">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-xl font-semibold text-purple-900 mb-2">Loading Shared Files...</h2>
          <p className="text-purple-600">Getting your shared files ready...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">🤝 Shared Files</h1>
          <p className="text-purple-600 text-lg">
            Files shared with you and files you've shared with others
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 mb-8 slide-up">
          <div className="flex space-x-1 bg-purple-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'received'
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              📥 Files Shared With You ({sharedFiles.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'sent'
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              📤 Files You've Shared (2)
            </button>
          </div>
        </div>

        {/* Shared Files List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-purple-900">
              {activeTab === 'received' ? '📥 Files Shared With You' : '📤 Files You\'ve Shared'}
            </h2>
            <div className="text-purple-600">
              {sharedFiles.length} file{sharedFiles.length !== 1 ? 's' : ''}
            </div>
          </div>

          {sharedFiles.length > 0 ? (
            <div className="space-y-4">
              {sharedFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-4 rounded-xl border-2 border-purple-200 bg-white hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getFileTypeColor(file.type)} rounded-xl flex items-center justify-center text-white text-xl`}>
                      {getFileIcon(file.type)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-purple-900">{file.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-purple-600">
                        <span>Size: {file.size}</span>
                        <span>Shared: {file.sharedAt}</span>
                        {activeTab === 'received' ? (
                          <span>By: {file.sharedBy}</span>
                        ) : (
                          <span>With: {file.sharedWith}</span>
                        )}
                        <span>Expires: {file.expiresAt}</span>
                      </div>
                      
                      {/* Expiry Warning */}
                      {getDaysUntilExpiry(file.expiresAt) <= 7 && (
                        <div className="mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getDaysUntilExpiry(file.expiresAt) <= 3
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            ⚠️ Expires in {getDaysUntilExpiry(file.expiresAt)} day{getDaysUntilExpiry(file.expiresAt) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownload(file.id)}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors flex items-center space-x-1"
                      >
                        <span>⬇️</span>
                        <span>Download</span>
                      </button>
                      
                      {activeTab === 'sent' && (
                        <button
                          onClick={() => handleRevokeAccess(file.id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center space-x-1"
                        >
                          <span>🚫</span>
                          <span>Revoke</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                {activeTab === 'received' ? '📥' : '📤'}
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">
                {activeTab === 'received' ? 'No files shared with you yet' : 'You haven\'t shared any files yet'}
              </h3>
              <p className="text-purple-600">
                {activeTab === 'received' 
                  ? 'When someone shares a file with you, it will appear here.'
                  : 'Share files with others to collaborate and work together.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Sharing Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 mt-8 slide-up">
          <h3 className="text-xl font-bold text-purple-900 mb-4">ℹ️ About File Sharing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">🔒 Security</h4>
              <p className="text-purple-600 text-sm">
                Shared files are encrypted and secure. Only people with the link can access them.
                You can revoke access at any time.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">⏰ Expiration</h4>
              <p className="text-purple-600 text-sm">
                Shared files automatically expire after 30 days for security. 
                You can extend the expiration date if needed.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">📊 Tracking</h4>
              <p className="text-purple-600 text-sm">
                You can see when files are downloaded and who accessed them. 
                This helps you track file usage and security.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">🤝 Collaboration</h4>
              <p className="text-purple-600 text-sm">
                Share files easily with team members, clients, or friends. 
                No need to send large files via email anymore.
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
              <p className="text-purple-600 text-sm">See all your files</p>
            </button>
            
            <button className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-100 transition-all duration-300 text-left group">
              <div className="text-2xl mb-2">📤</div>
              <h4 className="font-semibold text-purple-900 group-hover:text-purple-700">Upload Files</h4>
              <p className="text-purple-600 text-sm">Add new files to share</p>
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