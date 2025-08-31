import { useState } from 'react';
import { supabase } from '../lib/supabase';
import ShareModal from './ShareModal';
import FilePreview from './FilePreview';
import { API_URL } from "../lib/config";


export default function FileList({ files, onUpdate }) {
  const [downloading, setDownloading] = useState(null);
  const [sharingFile, setSharingFile] = useState(null);
  const [deletingFile, setDeletingFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const handleDownload = async (file) => {
    try {
      setDownloading(file.id);

      const { data, error } = await supabase.storage
        .from('files')
        .download(file.path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }
    
    try {
      setDeletingFile(fileId);
      
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/files/${fileId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});


      if (response.ok) {
        onUpdate();
      } else {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    } finally {
      setDeletingFile(null);
    }
  };

  const handleShare = (file) => {
    setSharingFile(file);
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No files uploaded yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {files.map((file) => (
            <li key={file.id} className="hover:bg-gray-50 transition-colors duration-150">
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <div className="flex-shrink-0">
                    {/* File icon based on file type */}
                    <FileIcon extension={file.name.split('.').pop()} />
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{file.name}</h3>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPreviewFile(file)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                    title="Preview file"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownload(file)}
                    disabled={downloading === file.id}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium disabled:opacity-50 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                    title="Download file"
                  >
                    {downloading === file.id ? 'Downloading...' : 'Download'}
                  </button>
                  <button
                    onClick={() => handleShare(file)}
                    className="text-green-600 hover:text-green-900 text-sm font-medium px-2 py-1 rounded hover:bg-green-50 transition-colors"
                    title="Share file"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    disabled={deletingFile === file.id}
                    className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    title="Delete file"
                  >
                    {deletingFile === file.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {sharingFile && (
        <ShareModal 
          file={sharingFile} 
          onClose={() => setSharingFile(null)}
          onSuccess={() => {
            setSharingFile(null);
            // Optionally refresh or show a success message
          }}
        />
      )}

      {previewFile && (
        <FilePreview 
          file={previewFile} 
          onClose={() => setPreviewFile(null)} 
        />
      )}
    </>
  );
}

// File icon component
function FileIcon({ extension }) {
  const iconClass = "w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-gray-500";
  
  const getIcon = () => {
    switch (extension?.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'mp4':
      case 'mov':
      case 'avi':
        return '🎬';
      case 'mp3':
      case 'wav':
        return '🎵';
      case 'zip':
      case 'rar':
        return '📦';
      default:
        return '📁';
    }
  };
  
  return (
    <div className={iconClass}>
      <span className="text-lg">{getIcon()}</span>
    </div>
  );
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
