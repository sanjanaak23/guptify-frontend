import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { API_URL } from '../lib/config';

export default function FilePreview({ file, onClose }) {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPreview();
  }, [file]);

  const fetchPreview = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/files/${file.id}/preview`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewData(data);
      } else {
        setError('Could not generate preview');
      }
    } catch (error) {
      console.error('Error fetching preview:', error);
      setError('Failed to load preview');
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (!previewData) return null;

    switch (previewData.fileType) {
      case 'image':
        return (
          <div className="flex justify-center">
            <img 
              src={previewData.previewUrl} 
              alt={previewData.fileName}
              className="max-w-full max-h-96 object-contain"
            />
          </div>
        );
      
      case 'pdf':
        return (
          <div className="w-full h-96">
            <iframe
              src={previewData.previewUrl}
              className="w-full h-full border-none"
              title={previewData.fileName}
            />
          </div>
        );
      
      case 'text':
        return (
          <div className="w-full h-96">
            <iframe
              src={previewData.previewUrl}
              className="w-full h-full border-none"
              title={previewData.fileName}
            />
          </div>
        );
      
      default:
        return (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-gray-500">Preview not available for this file type</p>
            <a 
              href={previewData.previewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
            >
              Download instead
            </a>
          </div>
        );
    }
  };

  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{file.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="text-center py-12">Loading preview...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : (
            renderPreview()
          )}
        </div>

        <div className="border-t pt-4 mt-4 flex justify-between">
          <span className="text-sm text-gray-500">
            {file.type} • {formatFileSize(file.size)}
          </span>
          <a 
            href={previewData?.previewUrl} 
            download={file.name}
            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
          >
            Download
          </a>
        </div>
      </div>
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