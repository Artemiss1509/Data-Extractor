import { useState } from 'react';
import './App.css';
import { useStorage } from './popup/hooks/useStorage';
import Header from './popup/components/Header';
import ContactsTab from './popup/components/ContactsTab';
import DealsTab from './popup/components/DealsTab';
import LeadsTab from './popup/components/LeadsTab';
import ActivitiesTab from './popup/components/ActivitiesTab';
import { exportAsJSON } from './popup/utils/export';

function App() {
  const [activeTab, setActiveTab] = useState('contacts');
  const { data, loading, error } = useStorage();

  const tabs = [
    { id: 'contacts', label: '📍 Contacts', count: data.contacts?.length || 0 },
    { id: 'deals', label: '💼 Deals', count: data.deals?.length || 0 },
    { id: 'leads', label: '🎯 Leads', count: data.leads?.length || 0 },
    { id: 'activities', label: '✅ Activities', count: data.activities?.length || 0 },
  ];

  const handleExportAll = () => {
    exportAsJSON(data, 'monday-crm-data.json');
  };

  if (loading) {
    return (
      <div className="w-[600px] h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2 animate-spin">⌛</div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[600px] h-[500px] flex items-center justify-center">
        <div className="text-center text-red-600">
          <div className="text-4xl mb-2"></div>
          <p>Error loading data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[600px] h-[500px] flex flex-col bg-gray-50">
      <Header />
      
      {}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={
                  `px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`
                }
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={
                    `ml-1.5 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600'
                    }`
                  }>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                )}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleExportAll}
            className="text-xs px-3 py-1.5 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Export all data as JSON"
          >
            📥 Export All (JSON)
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden p-4">
        {activeTab === 'contacts' && (
          <ContactsTab 
            contacts={data.contacts || []} 
            lastSync={data.lastSync?.contacts}
          />
        )}
        {activeTab === 'deals' && (
          <DealsTab 
            deals={data.deals || []} 
            lastSync={data.lastSync?.deals}
          />
        )}
        {activeTab === 'leads' && (
          <LeadsTab 
            leads={data.leads || []} 
            lastSync={data.lastSync?.leads}
          />
        )}
        {activeTab === 'activities' && (
          <ActivitiesTab 
            activities={data.activities || []} 
            lastSync={data.lastSync?.activities}
          />
        )}
      </div>
    </div>
  );
}

export default App
