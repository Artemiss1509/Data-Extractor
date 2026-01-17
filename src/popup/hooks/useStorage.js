import { useState, useEffect, useCallback } from 'react';

export function useStorage() {
  const [data, setData] = useState({
    contacts: [],
    deals: [],
    leads: [],
    activities: [],
    lastSync: {
      contacts: null,
      deals: null,
      leads: null,
      activities: null
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await chrome.storage.local.get('monday_data');
      
      if (result.monday_data) {
        setData(result.monday_data);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    const handleStorageChange = (changes, areaName) => {
      if (areaName === 'local' && changes.monday_data) {
        setData(changes.monday_data.newValue || changes.monday_data);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [loadData]);

  useEffect(() => {
    const handleMessage = (message) => {
      if (message.type === 'DATA_UPDATED' || message.type === 'STORAGE_CHANGED') {
        loadData();
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [loadData]);

  return { data, loading, error, reload: loadData };
}

export function useDeleteItem() {
  const [deleting, setDeleting] = useState(false);

  const deleteItem = useCallback(async (entityType, itemId) => {
    try {
      setDeleting(true);
      
      const result = await chrome.storage.local.get('monday_data');
      const data = result.monday_data || {};
      
      data[entityType] = (data[entityType] || []).filter(item => item.id !== itemId);
      
      await chrome.storage.local.set({ monday_data: data });
      
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  return { deleteItem, deleting };
}

export function useClearData() {
  const [clearing, setClearing] = useState(false);

  const clearAll = useCallback(async () => {
    try {
      setClearing(true);
      await chrome.storage.local.remove('monday_data');
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    } finally {
      setClearing(false);
    }
  }, []);

  const clearEntity = useCallback(async (entityType) => {
    try {
      setClearing(true);
      
      const result = await chrome.storage.local.get('monday_data');
      const data = result.monday_data || {};
      
      data[entityType] = [];
      data.lastSync[entityType] = null;
      
      await chrome.storage.local.set({ monday_data: data });
      
      return true;
    } catch (error) {
      console.error('Error clearing entity:', error);
      return false;
    } finally {
      setClearing(false);
    }
  }, []);

  return { clearAll, clearEntity, clearing };
}