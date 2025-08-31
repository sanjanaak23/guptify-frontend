import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Navigation from './components/Navigation'
import HomePage from './components/HomePage'
import FilesPage from './components/FilesPage'
import UploadPage from './components/UploadPage'
import SearchPage from './components/SearchPage'
import FoldersPage from './components/FoldersPage'
import TrashPage from './components/TrashPage'
import SharedPage from './components/SharedPage'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-xl font-semibold text-purple-900 mb-2">Guptify</h2>
          <p className="text-purple-600">Loading your secret cloud space...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        {session && <Navigation onSignOut={handleSignOut} />}
        <Routes>
          <Route 
            path="/" 
            element={session ? <Navigate to="/dashboard" /> : <Auth />} 
          />
          <Route 
            path="/dashboard" 
            element={session ? <HomePage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/files" 
            element={session ? <FilesPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/upload" 
            element={session ? <UploadPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/search" 
            element={session ? <SearchPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/folders" 
            element={session ? <FoldersPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/trash" 
            element={session ? <TrashPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/shared" 
            element={session ? <SharedPage /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App