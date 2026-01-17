import { getBoardInfo, BOARD_TYPES, waitForBoardLoad } from './board-detector.js';
import { indicator } from './extraction-indicator.js';
import { extractContacts } from './extractors/contacts-extractor.js';
import { extractDeals } from './extractors/deals-extractor.js';
import { extractLeads } from './extractors/leads-extractor.js';
import { extractActivities } from './extractors/activities-extractor.js';

console.log('🐶 Monday.com CRM Extractor - Content script loaded!');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_EXTRACTION') {
    handleExtraction(message.options).then(sendResponse);
    return true;
  }
});

async function waitForRows(timeout = 10000) {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const hasRows =
        document.querySelector('[data-testid^="item-"]') ||
        document.querySelector('.nameCellContainer--Ko8f5');

      if (hasRows) {
        clearInterval(interval);
        resolve(true);
      }

      if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject(new Error('Rows did not render in time'));
      }
    }, 250);
  });
}

async function handleExtraction(options = {}) {
  try {
    console.log('🚀 Starting extraction...');

    indicator.showExtracting('board', 'unknown');
    indicator.updateProgress('Waiting for board to load...');

    await waitForBoardLoad();
    await waitForRows();

    const boardInfo = getBoardInfo();
    console.log('📊 Board info:', boardInfo);

    indicator.showExtracting(boardInfo.type, boardInfo.viewType);

    let items = [];
    let entityType = '';

    switch (boardInfo.type) {

      case BOARD_TYPES.DEALS:
        entityType = 'deals';
        indicator.updateProgress('Extracting deals...');
        items = await extractDeals(boardInfo.viewType);
        break;

      case BOARD_TYPES.LEADS:
        entityType = 'leads';
        indicator.updateProgress('Extracting leads...');
        items = await extractLeads();
        break;

      case BOARD_TYPES.ACTIVITIES:
        entityType = 'activities';
        indicator.updateProgress('Extracting activities...');
        items = await extractActivities();
        break;
      
      case BOARD_TYPES.CONTACTS:
        entityType = 'contacts';
        indicator.updateProgress('Extracting contacts...');
        items = await extractContacts();
        break;

      default:
        throw new Error(
          `Unable to detect board type. Detected board: "${boardInfo.name}".`
        );
    }

    items = Array.isArray(items) ? items : [];

    await chrome.runtime.sendMessage({
      type: 'EXTRACTION_COMPLETE',
      data: { entityType, items, boardInfo }
    });

    if (items.length === 0) {
      indicator.updateProgress('No visible rows found');
    }

    indicator.showSuccess(entityType, items.length);

    return { success: true, entityType, count: items.length, boardInfo };

  } catch (error) {
    console.error('❌ Extraction error:', error);
    indicator.showError(error.message);

    chrome.runtime.sendMessage({
      type: 'EXTRACTION_ERROR',
      error: error.message
    }).catch(() => {});

    return { success: false, error: error.message };
  }
}

if (window.location.search.includes('auto_extract=true')) {
  waitForBoardLoad()
    .then(() => handleExtraction())
    .catch(() => {});
}
