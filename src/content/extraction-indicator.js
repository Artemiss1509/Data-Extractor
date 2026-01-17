export class ExtractionIndicator {
  constructor() {
    this.container = null;
    this.shadowRoot = null;
  }

  create() {
    if (this.container) {
      return;
    }

    this.container = document.createElement('div');
    this.container.id = 'monday-crm-extractor-indicator';
    
    this.shadowRoot = this.container.attachShadow({ mode: 'open' });
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          all: initial;
        }
        
        .indicator-wrapper {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .indicator {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          min-width: 300px;
          max-width: 400px;
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .indicator.hiding {
          animation: slideOut 0.3s ease-in;
        }
        
        .indicator.success {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }
        
        .indicator.error {
          background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
        }
        
        .indicator-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .indicator-title {
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .indicator-icon {
          font-size: 20px;
        }
        
        .indicator-message {
          font-size: 14px;
          opacity: 0.95;
          margin-top: 4px;
        }
        
        .indicator-details {
          font-size: 12px;
          opacity: 0.8;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.2s;
        }
        
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      </style>
      
      <div class="indicator-wrapper">
        <div class="indicator" id="indicator-box">
          <div class="indicator-header">
            <div class="indicator-title">
              <span class="indicator-icon" id="icon">🔄</span>
              <span id="title">Extracting Data...</span>
            </div>
            <button class="close-btn" id="close-btn">×</button>
          </div>
          <div class="indicator-message" id="message">Please wait...</div>
          <div class="indicator-details" id="details" style="display: none;"></div>
        </div>
      </div>
    `;
    
    // Add event listener for close button
    const closeBtn = this.shadowRoot.getElementById('close-btn');
    closeBtn.addEventListener('click', () => this.hide());
    

    document.body.appendChild(this.container);
  }

  showExtracting(boardType, viewType) {
    this.create();
    
    const indicator = this.shadowRoot.getElementById('indicator-box');
    const icon = this.shadowRoot.getElementById('icon');
    const title = this.shadowRoot.getElementById('title');
    const message = this.shadowRoot.getElementById('message');
    const details = this.shadowRoot.getElementById('details');
    
    indicator.className = 'indicator';
    icon.innerHTML = '<span class="spinner"></span>';
    title.textContent = 'Extracting Data...';
    message.textContent = `Detected ${boardType} board (${viewType} view)`;
    details.style.display = 'none';
  }

  /**
   * Show success state
   */
  showSuccess(boardType, count) {
    this.create();
    
    const indicator = this.shadowRoot.getElementById('indicator-box');
    const icon = this.shadowRoot.getElementById('icon');
    const title = this.shadowRoot.getElementById('title');
    const message = this.shadowRoot.getElementById('message');
    const details = this.shadowRoot.getElementById('details');
    
    indicator.className = 'indicator success';
    icon.textContent = '';
    title.textContent = 'Extraction Complete!';
    message.textContent = `Successfully extracted ${count} ${boardType} records`;
    details.textContent = 'Data saved to local storage';
    details.style.display = 'block';
    
    setTimeout(() => this.hide(), 3000);
  }

  showError(error) {
    this.create();
    
    const indicator = this.shadowRoot.getElementById('indicator-box');
    const title = this.shadowRoot.getElementById('title');
    const message = this.shadowRoot.getElementById('message');
    const details = this.shadowRoot.getElementById('details');
    
    indicator.className = 'indicator error';
    title.textContent = 'Extraction Failed';
    message.textContent = error || 'An error occurred during extraction';
    details.style.display = 'none';
    
    setTimeout(() => this.hide(), 5000);
  }

  updateProgress(message) {
    if (!this.shadowRoot) return;
    
    const messageEl = this.shadowRoot.getElementById('message');
    if (messageEl) {
      messageEl.textContent = message;
    }
  }

  hide() {
    if (!this.container) return;
    
    const indicator = this.shadowRoot.getElementById('indicator-box');
    indicator.classList.add('hiding');
    
    setTimeout(() => {
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
      this.container = null;
      this.shadowRoot = null;
    }, 300);
  }
}

export const indicator = new ExtractionIndicator();
