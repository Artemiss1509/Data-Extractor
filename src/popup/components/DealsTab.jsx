import { useState, useMemo } from 'react';
import SearchBar from './SearchBar';
import { useDeleteItem } from '../hooks/useStorage';
import { exportAsCSV } from '../utils/export';

export default function DealsTab({ deals, lastSync }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const { deleteItem, deleting } = useDeleteItem();

  const groups = useMemo(() => {
    const groupSet = new Set(deals.map(deal => deal.group || 'Ungrouped'));
    return ['all', ...Array.from(groupSet)];
  }, [deals]);

  const filteredDeals = deals.filter(deal => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      deal.name?.toLowerCase().includes(searchLower) ||
      deal.stage?.toLowerCase().includes(searchLower) ||
      deal.contact?.toLowerCase().includes(searchLower) ||
      deal.owner?.toLowerCase().includes(searchLower)
    );
    
    const matchesGroup = selectedGroup === 'all' || deal.group === selectedGroup;
    
    return matchesSearch && matchesGroup;
  });

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      await deleteItem('deals', id);
    }
  };

  const handleExport = () => {
    exportAsCSV(filteredDeals, 'deals');
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm}
            placeholder="Search deals by name, stage, contact, or owner..."
          />
        </div>
        <button
          onClick={handleExport}
          disabled={deals.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📄 Export CSV
        </button>
      </div>

      {}
      <div className="flex items-center gap-2 flex-wrap">
        {groups.map(group => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={
              `px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedGroup === group
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`
            }
          >
            {group === 'all' ? '📊 All' : group}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>💼 {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''}</span>
        {lastSync && (
          <span className="text-xs">
            Last sync: {new Date(lastSync).toLocaleString()}
          </span>
        )}
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">💼</div>
          <p>No deals extracted yet.</p>
          <p className="text-sm mt-1">Navigate to a Deals board and click "Extract Current Board"</p>
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <p>No deals match your search.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredDeals.map(deal => (
            <div key={deal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{deal.name}</h3>
                    {deal.group && deal.group !== 'Ungrouped' && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {deal.group}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    {deal.value !== null && (
                      <p>
                        <span className="text-gray-500">💵 Value:</span> <span className="font-semibold">{formatCurrency(deal.value)}</span>
                      </p>
                    )}
                    {deal.stage && (
                      <p>
                        <span className="text-gray-500">📈 Stage:</span> {deal.stage}
                      </p>
                    )}
                    {deal.probability !== null && (
                      <p>
                        <span className="text-gray-500">🎯 Probability:</span> {deal.probability}%
                      </p>
                    )}
                    {deal.closeDate && (
                      <p>
                        <span className="text-gray-500">📅 Close Date:</span> {deal.closeDate}
                      </p>
                    )}
                    {deal.contact && (
                      <p>
                        <span className="text-gray-500">👤 Contact:</span> {deal.contact}
                      </p>
                    )}
                    {deal.owner && (
                      <p>
                        <span className="text-gray-500">👥 Owner:</span> {deal.owner}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(deal.id)}
                  disabled={deleting}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50 ml-4"
                  title="Delete deal"
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
