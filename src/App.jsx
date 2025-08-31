import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Guptify</h2>
          <p className="text-gray-600">Loading your secret cloud space...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/" 
            element={session ? <Navigate to="/dashboard" /> : <Auth />} 
          />
          <Route 
            path="/dashboard" 
            element={session ? <Dashboard /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App