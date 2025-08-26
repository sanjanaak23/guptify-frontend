import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import FileUpload from './FileUpload'
import FileList from './FileList'

export default function Dashboard() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading files...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Guptify</h1>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-700 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FileUpload onUpload={fetchFiles} />
        <FileList files={files} onUpdate={fetchFiles} />
      </main>
    </div>
  )
}