import { useState } from 'react';
import SearchBar from './SearchBar';
import { useDeleteItem } from '../hooks/useStorage';
import { exportAsCSV } from '../utils/export';

export default function ActivitiesTab({ activities, lastSync }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { deleteItem, deleting } = useDeleteItem();

  const filteredActivities = activities.filter(activity => {
    const searchLower = searchTerm.toLowerCase();
    return (
      activity.subject?.toLowerCase().includes(searchLower) ||
      activity.type?.toLowerCase().includes(searchLower) ||
      activity.linkedTo?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      await deleteItem('activities', id);
    }
  };

  const handleExport = () => {
    exportAsCSV(filteredActivities, 'activities');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm}
            placeholder="Search activities by subject, type, or linked to..."
          />
        </div>
        <button
          onClick={handleExport}
          disabled={activities.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📄 Export CSV
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{filteredActivities.length} activit{filteredActivities.length !== 1 ? 'ies' : 'y'}</span>
        {lastSync && (
          <span className="text-xs">
            Last sync: {new Date(lastSync).toLocaleString()}
          </span>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2"></div>
          <p>No activities extracted yet.</p>
          <p className="text-sm mt-1">Navigate to an Activities board and click "Extract Current Board"</p>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2"></div>
          <p>No activities match your search.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredActivities.map(activity => (
            <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{activity.subject}</h3>
                    {activity.type && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        {activity.type}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 space-y-1 text-sm">
                    {activity.date && (
                      <p>
                        <span className="text-gray-500">Date:</span> {activity.date}
                      </p>
                    )}
                    {activity.linkedTo && (
                      <p>
                        <span className="text-gray-500">Linked to:</span> {activity.linkedTo}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(activity.id)}
                  disabled={deleting}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50 ml-4"
                  title="Delete activity"
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
