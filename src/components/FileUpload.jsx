import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function FileUpload({ onUpload }) {
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
      <label className="block text-sm font-medium text-gray-700">
        Upload File
      </label>
      <div className="mt-1 flex items-center">
        <input
          type="file"
          disabled={uploading}
          onChange={handleUpload}
          className="py-2 px-3 border border-gray-300 rounded-md text-sm"
        />
      </div>
    </div>
  )
}