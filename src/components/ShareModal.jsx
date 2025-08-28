import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ShareModal({ file, onClose }) {
  const [shareLink, setShareLink] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareLink = async () => {
    setGenerating(true);
    
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`http://localhost:3001/files/${file.id}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expiresIn: 86400 }) // 24 hours
      });

      if (response.ok) {
        const data = await response.json();
        setShareLink(data.signedUrl);
      }
    } catch (error) {
      console.error('Error generating share link:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Share {file.name}</h2>
        
        {!shareLink ? (
          <div>
            <p className="mb-4">Generate a shareable link that will expire in 24 hours.</p>
            <button
              onClick={generateShareLink}
              disabled={generating}
              className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate Share Link'}
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2 text-sm text-gray-600">Share this link:</p>
            <div className="flex mb-4">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="bg-indigo-600 text-white px-3 py-2 rounded-r-md"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-500">This link will expire in 24 hours.</p>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}