import { useState, useCallback } from 'react';

export function useExtraction() {
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const startExtraction = useCallback(async () => {
    try {
      setExtracting(true);
      setError(null);
      setResult(null);

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url || !tab.url.includes('monday.com')) {
        throw new Error('Please navigate to a Monday.com board first');
      }

      const response = await chrome.runtime.sendMessage({
        type: 'EXTRACT_BOARD',
        options: {}
      });

      if (response && response.success) {
        setResult(response);
        return response;
      } else {
        throw new Error(response?.error || 'Extraction failed');
      }
    } catch (err) {
      console.error('Extraction error:', err);
      setError(err.message);
      throw err;
    } finally {
      setExtracting(false);
    }
  }, []);

  return { startExtraction, extracting, error, result };
}
