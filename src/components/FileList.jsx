import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function FileList({ files, onUpdate }) {
  const [downloading, setDownloading] = useState(null)

  const handleDownload = async (file) => {
    try {
      setDownloading(file.id)

      const { data, error } = await supabase.storage
        .from('files')
        .download(file.path)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading file:', error)
    } finally {
      setDownloading(null)
    }
  }

  const handleDelete = async (fileId) => {
    try {
      const { error } = await supabase
        .from('files')
        .update({ is_deleted: true })
        .eq('id', fileId)

      if (error) throw error

      onUpdate()
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No files uploaded yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {files.map((file) => (
          <li key={file.id}>
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">{file.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(file)}
                  disabled={downloading === file.id}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium disabled:opacity-50"
                >
                  {downloading === file.id ? 'Downloading...' : 'Download'}
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}