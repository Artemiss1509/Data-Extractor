import { useState } from 'react';
import SearchBar from './SearchBar';
import { useDeleteItem } from '../hooks/useStorage';
import { exportAsCSV } from '../utils/export';

export default function LeadsTab({ leads, lastSync }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { deleteItem, deleting } = useDeleteItem();

  const filteredLeads = leads.filter(lead => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(searchLower) ||
      lead.company?.toLowerCase().includes(searchLower) ||
      lead.email?.toLowerCase().includes(searchLower) ||
      lead.status?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      await deleteItem('leads', id);
    }
  };

  const handleExport = () => {
    exportAsCSV(filteredLeads, 'leads');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm}
            placeholder="Search leads by name, company, email, or status..."
          />
        </div>
        <button
          onClick={handleExport}
          disabled={leads.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📄 Export CSV
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>🎯 {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}</span>
        {lastSync && (
          <span className="text-xs">
            Last sync: {new Date(lastSync).toLocaleString()}
          </span>
        )}
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">🎯</div>
          <p>No leads extracted yet.</p>
          <p className="text-sm mt-1">Navigate to a Leads board and click "Extract Current Board"</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <p>No leads match your search.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredLeads.map(lead => (
            <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{lead.name}</h3>
                    {lead.status && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        {lead.status}
                      </span>
                    )}
                  </div>
                  
                  {lead.company && <p className="text-sm text-gray-600">🏢 {lead.company}</p>}
                  
                  <div className="mt-2 space-y-1">
                    {lead.email && (
                      <p className="text-sm">
                        <span className="text-gray-500">✉️</span> {lead.email}
                      </p>
                    )}
                    {lead.phone && (
                      <p className="text-sm">
                        <span className="text-gray-500">📞</span> {lead.phone}
                      </p>
                    )}
                    {lead.owner && (
                      <p className="text-sm">
                        <span className="text-gray-500">👤</span> {lead.owner}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(lead.id)}
                  disabled={deleting}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50 ml-4"
                  title="Delete lead"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
