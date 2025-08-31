import { useState } from 'react';
import SearchBar from './SearchBar';
import FileList from './FileList';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  const handleSearch = (results, query) => {
    setSearchResults(results);
    setSearchQuery(query);
    
    // Add to search history
    if (query && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 9)]);
    }
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleHistoryClick = (query) => {
    setSearchQuery(query);
    // Trigger search with this query
    // You can implement this based on your search functionality
  };

  const popularSearches = [
    'Documents', 'Images', 'Videos', 'Music', 'PDFs', 'Spreadsheets', 'Presentations'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
            🔍 Search Files
          </h1>
          <p className="text-xl text-purple-700 mb-2">
            Find your files quickly and easily
          </p>
          <p className="text-purple-600">
            Search by name, type, or content to locate exactly what you need
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200 mb-8 slide-up">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
              🔍
            </div>
            <h2 className="text-2xl font-bold text-purple-900 mb-2">
              What are you looking for?
            </h2>
            <p className="text-purple-600">
              Type your search query below to find your files
            </p>
          </div>
          
          <SearchBar 
            onSearch={handleSearch} 
            onClear={handleClearSearch}
            placeholder="Search for files, documents, images..."
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 mb-8 slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-purple-900">
                🔍 Search Results for "{searchQuery}"
              </h3>
              <div className="text-purple-600">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </div>
            </div>
            
            <FileList 
              files={searchResults} 
              onRefresh={() => {}}
              showActions={true}
            />
            
            <div className="mt-6 text-center">
              <button
                onClick={handleClearSearch}
                className="px-6 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Search Tips */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 mb-8 slide-up">
          <h3 className="text-xl font-bold text-purple-900 mb-4">💡 Search Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">🔤 File Names</h4>
              <p className="text-purple-600 text-sm mb-3">
                Search for files by typing part of the filename
              </p>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-purple-700 text-sm font-mono">
                  Example: "report" finds "monthly_report.pdf"
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">📁 File Types</h4>
              <p className="text-purple-600 text-sm mb-3">
                Search by file extension or type
              </p>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-purple-700 text-sm font-mono">
                  Example: ".pdf" finds all PDF files
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">📅 Dates</h4>
              <p className="text-purple-600 text-sm mb-3">
                Find files by when they were created or modified
              </p>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-purple-700 text-sm font-mono">
                  Example: "today" or "yesterday"
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">📂 Folders</h4>
              <p className="text-purple-600 text-sm mb-3">
                Search within specific folders
              </p>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-purple-700 text-sm font-mono">
                  Example: "work documents"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 mb-8 slide-up">
            <h3 className="text-xl font-bold text-purple-900 mb-4">📋 Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(query)}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors text-sm"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 slide-up">
          <h3 className="text-xl font-bold text-purple-900 mb-4">🔥 Popular Searches</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(search)}
                className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 text-center group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {search === 'Documents' && '📄'}
                  {search === 'Images' && '🖼️'}
                  {search === 'Videos' && '🎥'}
                  {search === 'Music' && '🎵'}
                  {search === 'PDFs' && '📕'}
                  {search === 'Spreadsheets' && '📊'}
                  {search === 'Presentations' && '📽️'}
                </div>
                <h4 className="font-semibold text-purple-900 text-sm">{search}</h4>
              </button>
            ))}
          </div>
        </div>

        {/* No Results State */}
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200 text-center slide-up">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">No files found</h3>
            <p className="text-purple-600 mb-6">
              We couldn't find any files matching "{searchQuery}"
            </p>
            <div className="space-y-2 text-sm text-purple-600">
              <p>• Check your spelling</p>
              <p>• Try different keywords</p>
              <p>• Use broader search terms</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}