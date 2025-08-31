import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { API_URL } from '../lib/config';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalFolders: 0,
    recentFiles: [],
    storageUsed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = (await supabase.auth.getSession()).data.session?.access_token;

      // Fetch basic stats
      const response = await fetch(`${API_URL}/files?page=1&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          totalFiles: data.pagination.total || 0,
          totalFolders: 0, // You can add folder count API later
          recentFiles: data.files || [],
          storageUsed: 0 // You can add storage calculation later
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const featureCards = [
    {
      title: '📁 My Files',
      description: 'View and manage all your uploaded files',
      path: '/files',
      color: 'from-purple-500 to-purple-600',
      icon: '📁'
    },
    {
      title: '📂 Folders',
      description: 'Organize your files into folders',
      path: '/folders',
      color: 'from-indigo-500 to-indigo-600',
      icon: '📂'
    },
    {
      title: '📤 Upload Files',
      description: 'Upload new files to your cloud space',
      path: '/upload',
      color: 'from-green-500 to-green-600',
      icon: '📤'
    },
    {
      title: '🔍 Search',
      description: 'Find files quickly with smart search',
      path: '/search',
      color: 'from-blue-500 to-blue-600',
      icon: '🔍'
    },
    {
      title: '🗑️ Trash',
      description: 'Manage deleted files and restore them',
      path: '/trash',
      color: 'from-red-500 to-red-600',
      icon: '🗑️'
    },
    {
      title: '🤝 Shared',
      description: 'View and manage shared files',
      path: '/shared',
      color: 'from-pink-500 to-pink-600',
      icon: '🤝'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-spin">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-xl font-semibold text-purple-900 mb-2">Loading...</h2>
          <p className="text-purple-600">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
            Welcome to Guptify! 🎉
          </h1>
          <p className="text-xl text-purple-700 mb-2">
            Your Secret Cloud Space
          </p>
          <p className="text-purple-600">
            Secure, private, and organized file management
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 transform hover:scale-105">
            <div className="text-center">
              <div className="text-3xl mb-2">📁</div>
              <h3 className="text-2xl font-bold text-purple-900">{stats.totalFiles}</h3>
              <p className="text-purple-600">Total Files</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 transform hover:scale-105">
            <div className="text-center">
              <div className="text-3xl mb-2">📂</div>
              <h3 className="text-2xl font-bold text-purple-900">{stats.totalFolders}</h3>
              <p className="text-purple-600">Folders</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 transform hover:scale-105">
            <div className="text-center">
              <div className="text-3xl mb-2">💾</div>
              <h3 className="text-2xl font-bold text-purple-900">{stats.storageUsed} MB</h3>
              <p className="text-purple-600">Storage Used</p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feature, index) => (
            <Link
              key={feature.path}
              to={feature.path}
              className="group"
            >
              <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 transform hover:scale-105 hover:shadow-xl card`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2 group-hover:text-purple-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-purple-600 group-hover:text-purple-500 transition-colors">
                  {feature.description}
                </p>
                <div className="mt-4 text-purple-500 font-medium group-hover:text-purple-600 transition-colors">
                  Get Started →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Files Section */}
        {stats.recentFiles.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">📋 Recent Files</h2>
            <div className="space-y-3">
              {stats.recentFiles.slice(0, 5).map((file, index) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-purple-600">📄</span>
                    <span className="font-medium text-purple-900">{file.name}</span>
                  </div>
                  <span className="text-sm text-purple-600">
                    {new Date(file.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                to="/files"
                className="inline-block px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transform hover:scale-105 transition-all duration-300"
              >
                View All Files
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}