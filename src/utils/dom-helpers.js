export function getTextContent(element) {
  if (!element) return '';
  return element.textContent?.trim() || '';
}

export function getText(elementOrSelector, parent = document) {
  if (typeof elementOrSelector === 'string') {
    const element = parent.querySelector(elementOrSelector);
    return getTextContent(element);
  }
  return getTextContent(elementOrSelector);
}

export function extractEmail(text) {
  if (!text) return '';
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return emailMatch ? emailMatch[0] : '';
}

export function extractPhone(text) {
  if (!text) return '';
  const phoneMatch = text.match(/[\d\s()+-]{10,}/);
  return phoneMatch ? phoneMatch[0].trim() : '';
}

export function extractNumber(text) {
  if (!text) return null;
  const numMatch = text.match(/[\d,.]+/);
  if (!numMatch) return null;
  return parseFloat(numMatch[0].replace(/,/g, ''));
}

export function generateId(text) {
  if (!text) return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `id_${Math.abs(hash)}_${Date.now()}`;
}

export function findParentWithClass(element, classSubstring) {
  let current = element;
  while (current && current !== document.body) {
    if (current.className && current.className.includes && current.className.includes(classSubstring)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

export function getAllTexts(parent, selector) {
  const elements = parent.querySelectorAll(selector);
  return Array.from(elements).map(el => getTextContent(el));
}

export async function waitForElement(selector, timeout = 5000, parent = document) {
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    const element = parent.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver(() => {
      const element = parent.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
      
      if (Date.now() - startTime > timeout) {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }
    });
    
    observer.observe(parent, {
      childList: true,
      subtree: true
    });
  });
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function isVisible(element) {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0';
}
