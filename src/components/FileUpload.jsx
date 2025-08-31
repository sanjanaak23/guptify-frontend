import { useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export default function FileUpload({ onUploadComplete, currentFolder = 'root' }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // Check if Supabase is properly configured
  const checkSupabaseConfig = () => {
    if (!supabase || !supabase.storage) {
      throw new Error('Supabase storage is not properly configured. Please check your environment variables.');
    }
    
    // Check if the 'files' bucket exists and is accessible
    return true;
  };

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size must be less than 10MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }
    
    if (!file.name || file.name.trim() === '') {
      throw new Error('File must have a name');
    }
    
    return true;
  };

  const handleFileUpload = async (file) => {
    try {
      setError('');
      setSuccess('');
      setUploading(true);
      setUploadProgress(0);

      // Check Supabase configuration first
      checkSupabaseConfig();

      // Validate file
      validateFile(file);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = currentFolder === 'root' ? fileName : `${currentFolder}/${fileName}`;

      // Simulate upload progress (since Supabase doesn't provide progress callbacks)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (uploadError) {
        clearInterval(progressInterval);
        console.error('Supabase upload error:', uploadError);
        
        // Provide more specific error messages
        if (uploadError.message.includes('bucket')) {
          throw new Error('Storage bucket not found. Please check your Supabase configuration.');
        } else if (uploadError.message.includes('permission')) {
          throw new Error('Permission denied. Please check your Supabase storage policies.');
        } else {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(filePath);

      // Insert file metadata to database
      const { error: dbError } = await supabase
        .from('files')
        .insert([
          {
            name: file.name,
            size: file.size,
            type: file.type,
            path: filePath,
            url: publicUrl,
            folder_id: currentFolder === 'root' ? null : currentFolder,
          },
        ]);

      if (dbError) {
        clearInterval(progressInterval);
        console.error('Database error:', dbError);
        
        // Provide more specific error messages for database issues
        if (dbError.message.includes('relation')) {
          throw new Error('Database table not found. Please check your Supabase database setup.');
        } else if (dbError.message.includes('permission')) {
          throw new Error('Database permission denied. Please check your Supabase policies.');
        } else {
          throw new Error(`Database error: ${dbError.message}`);
        }
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Success message
      setSuccess(`File "${file.name}" uploaded successfully!`);
      
      // Call the callback with the uploaded file info
      if (onUploadComplete) {
        onUploadComplete([{
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          path: filePath,
          url: publicUrl
        }]);
      }

      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
        setSuccess('');
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragEnter = (e) => handleDrag(e);
  const handleDragLeave = (e) => handleDrag(e);
  const handleDragOver = (e) => handleDrag(e);
  const handleDropEvent = (e) => handleDrop(e);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('text')) return '📄';
    if (fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('presentation')) return '📽️';
    return '📁';
  };

  return (
    <div className="w-full">
      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
        disabled={uploading}
      />

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
          dragActive
            ? 'border-purple-400 bg-purple-50 scale-105'
            : 'border-purple-300 hover:border-purple-400 hover:bg-purple-50'
        } ${uploading ? 'pointer-events-none opacity-75' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDropEvent}
        onClick={openFileDialog}
      >
        {/* Upload Icon */}
        <div className="text-6xl mb-4">📤</div>
        
        {/* Upload Text */}
        <h3 className="text-xl font-bold text-purple-900 mb-2">
          {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
        </h3>
        
        <p className="text-purple-600 mb-2">
          Any file type up to 10MB
        </p>
        
        <p className="text-sm text-purple-500">
          {dragActive ? 'Drop your file here!' : 'Click to browse or drag and drop'}
        </p>

        {/* Upload Progress */}
        {uploading && (
          <div className="mt-6">
            <div className="w-full bg-purple-200 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-purple-600">{uploadProgress}% complete</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">❌</span>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
          <div className="mt-2 text-sm text-red-600">
            <p>Common solutions:</p>
            <ul className="list-disc list-inside ml-2">
              <li>Check your internet connection</li>
              <li>Verify Supabase configuration</li>
              <li>Ensure file size is under 10MB</li>
              <li>Try a different file type</li>
            </ul>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span className="text-green-700 font-medium">{success}</span>
          </div>
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-purple-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-2"></div>
            <span className="font-medium">Uploading your file...</span>
          </div>
        </div>
      )}

      {/* File Type Examples */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {['image', 'document', 'video', 'audio'].map((type) => (
          <div key={type} className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl mb-1">
              {getFileIcon(type)}
            </div>
            <p className="text-xs text-purple-600 capitalize">{type}s</p>
          </div>
        ))}
      </div>

      {/* Configuration Check */}
      <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <h4 className="font-semibold text-blue-900 mb-2">🔧 Configuration Check</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>• Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          <p>• Storage Bucket: files</p>
          <p>• Database Table: files</p>
        </div>
      </div>
    </div>
  );
}