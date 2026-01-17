import { initializeStorage, updateEntityData } from '../storage/storage-manager.js';

chrome.runtime.onInstalled.addListener(async () => {
  console.log('📦 Monday.com CRM Extractor installed!');
  await initializeStorage();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Message received:', message.type);
  
  handleMessage(message, sender).then(sendResponse);
  
  return true;
});


async function handleMessage(message, sender) {
  try {
    switch (message.type) {
      case 'EXTRACT_BOARD':
        return await handleExtractBoard(message, sender);
      
      case 'EXTRACTION_COMPLETE':
        return await handleExtractionComplete(message);
      
      case 'EXTRACTION_ERROR':
        return await handleExtractionError(message);
      
      case 'GET_ACTIVE_TAB':
        return await getActiveTab();
      
      case 'PING':
        return { success: true, message: 'pong' };
      
      default:
        console.warn('⚠️ Unknown message type:', message.type);
        return { success: false, error: 'Unknown message type' };
    }
  } catch (error) {
    console.error('❌ Error handling message:', error);
    return { success: false, error: error.message };
  }
}

async function handleExtractBoard(message) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      throw new Error('No active tab found');
    }
    
    if (!tab.url || !tab.url.includes('monday.com')) {
      return {
        success: false,
        error: 'Current tab is not a Monday.com page. Please navigate to Monday.com first.'
      };
    }
    
    
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'START_EXTRACTION',
      options: message.options || {}
    });
    
    return response;
  } catch (error) {
    console.error('❌ Error in handleExtractBoard:', error);
    return { success: false, error: error.message };
  }
}

async function handleExtractionComplete(message) {
  try {
    const { entityType, items, boardInfo } = message.data;
    
    console.log(`✅ Extraction complete for ${entityType}:`, items.length, 'items');
    
    await updateEntityData(entityType, items, true);
    
    chrome.runtime.sendMessage({
      type: 'DATA_UPDATED',
      entityType,
      count: items.length,
      boardInfo
    }).catch(() => {
      // No listeners, that's okay
    });
    
    return { success: true, count: items.length };
  } catch (error) {
    console.error('❌ Error handling extraction complete:', error);
    return { success: false, error: error.message };
  }
}

async function handleExtractionError(message) {
  console.error('❌ Extraction error:', message.error);
  
  chrome.runtime.sendMessage({
    type: 'EXTRACTION_ERROR',
    error: message.error
  }).catch(() => {
    // Popup might not be open
  });
  
  return { success: true };
}

async function getActiveTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      return { success: false, error: 'No active tab' };
    }
    
    return {
      success: true,
      tab: {
        id: tab.id,
        url: tab.url,
        title: tab.title,
        isMondayPage: tab.url?.includes('monday.com') || false
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.monday_data) {
    console.log('💾 Storage updated, broadcasting to all contexts');
    
    chrome.runtime.sendMessage({
      type: 'STORAGE_CHANGED',
      changes: changes.monday_data
    }).catch(() => {
      // No listeners, that's okay
    });
  }
});

console.log('Service worker ready!');
