import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { API_URL } from '../lib/config';

export default function SearchBar({ onSearchResults, onClearSearch }) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    sizeMin: '',
    sizeMax: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      onClearSearch();
      return;
    }

    setSearching(true);
    
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('query', query);
      
      if (filters.type) params.append('type', filters.type);
      if (filters.sizeMin) params.append('sizeMin', filters.sizeMin);
      if (filters.sizeMax) params.append('sizeMax', filters.sizeMax);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);

      const response = await fetch(`${API_URL}/files/search?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        onSearchResults(data.files);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setFilters({
      type: '',
      sizeMin: '',
      sizeMax: '',
      dateFrom: '',
      dateTo: ''
    });
    onClearSearch();
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="mb-2">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files..."
            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={searching}
            className="bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 disabled:opacity-50"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-200 text-gray-700 px-3 py-2 hover:bg-gray-300"
          >
            Filters
          </button>
          <button
            type="button"
            onClick={clearSearch}
            className="bg-red-600 text-white px-4 py-2 rounded-r-md hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </form>

      {showFilters && (
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All types</option>
                <option value="image">Images</option>
                <option value="pdf">PDFs</option>
                <option value="document">Documents</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size Range (MB)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.sizeMin}
                  onChange={(e) => setFilters({...filters, sizeMin: e.target.value})}
                  className="w-1/2 border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.sizeMax}
                  onChange={(e) => setFilters({...filters, sizeMax: e.target.value})}
                  className="w-1/2 border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  className="w-1/2 border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  className="w-1/2 border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}