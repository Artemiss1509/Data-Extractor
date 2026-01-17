import { useState } from 'react';
import SearchBar from './SearchBar';
import { useDeleteItem } from '../hooks/useStorage';
import { exportAsCSV } from '../utils/export';

export default function ContactsTab({ contacts, lastSync }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { deleteItem, deleting } = useDeleteItem();

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.phone?.includes(searchTerm) ||
      contact.account?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      await deleteItem('contacts', id);
    }
  };

  const handleExport = () => {
    exportAsCSV(filteredContacts, 'contacts');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search contacts by name, email, phone, or company..."
          />
        </div>
        <button
          onClick={handleExport}
          disabled={contacts.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📄 Export CSV
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>📊 {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}</span>
        {lastSync && (
          <span className="text-xs">
            Last sync: {new Date(lastSync).toLocaleString()}
          </span>
        )}
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">💭</div>
          <p>No contacts extracted yet.</p>
          <p className="text-sm mt-1">Navigate to a Contacts board and click "Extract Current Board"</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <p>No contacts match your search.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredContacts.map(contact => (
            <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{contact.name}</h3>

                  {contact.group && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                      {contact.group}
                    </span>
                  )}

                  {contact.title && (
                    <p className="text-sm text-gray-600 mt-1">
                      {contact.title}
                    </p>
                  )}

                  {contact.account && (
                    <p className="text-sm text-gray-600">
                      🏢 {contact.account}
                    </p>
                  )}

                  <div className="mt-3 space-y-1">
                    {contact.email && (
                      <p className="text-sm">
                        <span className="text-gray-500">✉️</span> {contact.email}
                      </p>
                    )}
                    {contact.phone && (
                      <p className="text-sm">
                        <span className="text-gray-500">📞</span> {contact.phone}
                      </p>
                    )}
                    {contact.owner && (
                      <p className="text-sm">
                        <span className="text-gray-500">👤</span> {contact.owner}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(contact.id)}
                  disabled={deleting}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50 ml-4"
                  title="Delete contact"
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
