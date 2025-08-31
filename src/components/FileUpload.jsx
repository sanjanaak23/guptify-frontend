import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function FileUpload({ onUpload, currentFolder }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a file to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Insert file metadata to database
      const { error: dbError } = await supabase
        .from('files')
        .insert([
          {
            name: file.name,
            size: file.size,
            type: file.type,
            path: filePath,
            folder_id: currentFolder === 'root' ? null : currentFolder,
          },
        ])

      if (dbError) throw dbError

      onUpload()
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
          <div className="space-y-2">
            <div className="text-4xl">📁</div>
            <div className="text-gray-600">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Click to upload
                </span>
                <span> or drag and drop</span>
              </label>
            </div>
            <p className="text-sm text-gray-500">Any file type up to 10MB</p>
          </div>
          <input
            id="file-upload"
            type="file"
            disabled={uploading}
            onChange={handleUpload}
            className="hidden"
          />
        </div>
        {uploading && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center text-indigo-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
              Uploading file...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}