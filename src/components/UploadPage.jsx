import { useState } from 'react';
import FileUpload from './FileUpload';

export default function UploadPage() {
  const [uploadHistory, setUploadHistory] = useState([]);

  const handleUploadComplete = (uploadedFiles) => {
    const newUploads = uploadedFiles.map(file => ({
      ...file,
      timestamp: new Date().toLocaleString(),
      status: 'success'
    }));
    setUploadHistory(prev => [...newUploads, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
            📤 Upload Files
          </h1>
          <p className="text-xl text-purple-700 mb-2">
            Add new files to your secret cloud space
          </p>
          <p className="text-purple-600">
            Drag and drop or click to upload any file type up to 10MB
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200 mb-8 slide-up">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6">
              📤
            </div>
            <h2 className="text-2xl font-bold text-purple-900 mb-4">
              Ready to Upload?
            </h2>
            <p className="text-purple-600 mb-8 max-w-md mx-auto">
              Your files will be securely stored and encrypted in your private cloud space. 
              Only you can access them!
            </p>
          </div>
          
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>

        {/* Upload Tips */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 mb-8 slide-up">
          <h3 className="text-xl font-bold text-purple-900 mb-4">💡 Upload Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                1
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">File Size</h4>
                <p className="text-purple-600 text-sm">Maximum file size is 10MB per file</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                2
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">File Types</h4>
                <p className="text-purple-600 text-sm">All file types are supported</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                3
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">Security</h4>
                <p className="text-purple-600 text-sm">Files are encrypted and private</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                4
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">Organization</h4>
                <p className="text-purple-600 text-sm">Create folders to organize files</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload History */}
        {uploadHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 slide-up">
            <h3 className="text-xl font-bold text-purple-900 mb-4">📋 Recent Uploads</h3>
            <div className="space-y-3">
              {uploadHistory.slice(0, 10).map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-purple-600">✅</span>
                    <span className="font-medium text-purple-900">{file.name}</span>
                  </div>
                  <span className="text-sm text-purple-600">{file.timestamp}</span>
                </div>
              ))}
            </div>
            {uploadHistory.length > 10 && (
              <p className="text-center text-purple-600 mt-4">
                And {uploadHistory.length - 10} more uploads...
              </p>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 slide-up">
          <h3 className="text-xl font-bold text-purple-900 mb-4">🚀 Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-100 transition-all duration-300 text-left group">
              <div className="text-2xl mb-2">📁</div>
              <h4 className="font-semibold text-purple-900 group-hover:text-purple-700">View Files</h4>
              <p className="text-purple-600 text-sm">See all your uploaded files</p>
            </button>
            
            <button className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-100 transition-all duration-300 text-left group">
              <div className="text-2xl mb-2">📂</div>
              <h4 className="font-semibold text-purple-900 group-hover:text-purple-700">Create Folder</h4>
              <p className="text-purple-600 text-sm">Organize your files</p>
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