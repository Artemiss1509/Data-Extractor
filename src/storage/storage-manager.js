const STORAGE_KEY = 'monday_data';

export async function initializeStorage() {
  try {
    const data = await chrome.storage.local.get(STORAGE_KEY);
    
    if (!data[STORAGE_KEY]) {
      const defaultData = {
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
      };
      
      await chrome.storage.local.set({ [STORAGE_KEY]: defaultData });
      return defaultData;
    }
    
    return data[STORAGE_KEY];
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
}

export async function getAllData() {
  try {
    const data = await chrome.storage.local.get(STORAGE_KEY);
    return data[STORAGE_KEY] || await initializeStorage();
  } catch (error) {
    console.error('Error getting all data:', error);
    throw error;
  }
}

export async function getEntityData(entityType) {
  try {
    const allData = await getAllData();
    return allData[entityType] || [];
  } catch (error) {
    console.error(`Error getting ${entityType} data:`, error);
    throw error;
  }
}

function mergeAndDeduplicate(existingItems, newItems) {
  const itemMap = new Map();
  
  existingItems.forEach(item => {
    if (item.id) {
      itemMap.set(item.id, item);
    }
  });
  
  newItems.forEach(item => {
    if (item.id) {
      itemMap.set(item.id, { ...itemMap.get(item.id), ...item });
    }
  });
  
  return Array.from(itemMap.values());
}

export async function updateEntityData(entityType, newItems, shouldMerge = true) {
  try {
    const lockKey = `${STORAGE_KEY}_lock_${entityType}`;
    
    const lock = await chrome.storage.local.get(lockKey);
    const now = Date.now();
    
    if (lock[lockKey] && (now - lock[lockKey]) < 5000) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return updateEntityData(entityType, newItems, shouldMerge);
    }
    
    await chrome.storage.local.set({ [lockKey]: now });
    
    try {
      const allData = await getAllData();
      
      if (shouldMerge) {
        allData[entityType] = mergeAndDeduplicate(allData[entityType] || [], newItems);
      } else {
        allData[entityType] = newItems;
      }
      
      allData.lastSync[entityType] = Date.now();
      
      await chrome.storage.local.set({ [STORAGE_KEY]: allData });
      
      return allData[entityType];
    } finally {
      await chrome.storage.local.remove(lockKey);
    }
  } catch (error) {
    console.error(`Error updating ${entityType} data:`, error);
    throw error;
  }
}

export async function deleteItem(entityType, itemId) {
  try {
    const allData = await getAllData();
    
    allData[entityType] = (allData[entityType] || []).filter(
      item => item.id !== itemId
    );
    
    await chrome.storage.local.set({ [STORAGE_KEY]: allData });
    
    return true;
  } catch (error) {
    console.error(`Error deleting item from ${entityType}:`, error);
    throw error;
  }
}

export async function clearEntityData(entityType) {
  try {
    const allData = await getAllData();
    allData[entityType] = [];
    allData.lastSync[entityType] = null;
    
    await chrome.storage.local.set({ [STORAGE_KEY]: allData });
    
    return true;
  } catch (error) {
    console.error(`Error clearing ${entityType} data:`, error);
    throw error;
  }
}

export async function clearAllData() {
  try {
    await chrome.storage.local.remove(STORAGE_KEY);
    return await initializeStorage();
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
}

export async function getLastSync(entityType) {
  try {
    const allData = await getAllData();
    return allData.lastSync[entityType];
  } catch (error) {
    console.error(`Error getting last sync for ${entityType}:`, error);
    return null;
  }
}

export async function exportAsJSON() {
  try {
    const data = await getAllData();
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting as JSON:', error);
    throw error;
  }
}

export async function exportAsCSV(entityType) {
  try {
    const items = await getEntityData(entityType);
    
    if (items.length === 0) {
      return '';
    }
    
    const keys = [...new Set(items.flatMap(item => Object.keys(item)))];
    
    const header = keys.join(',');
    const rows = items.map(item => {
      return keys.map(key => {
        const value = item[key];
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    });
    
    return [header, ...rows].join('\n');
  } catch (error) {
    console.error(`Error exporting ${entityType} as CSV:`, error);
    throw error;
  }
}
