# Monday.com CRM Data Extractor

A Chrome Extension that extracts CRM data from Monday.com boards (Contacts, Deals, Leads, Activities) and displays them in a beautiful, searchable dashboard.

## ✨ Features

- 📊 **Multi-Board Support**: Extract from Contacts, Deals, Leads, and Activities boards
- 📦 **Group Context**: Captures Monday.com Groups (e.g., "Active Deals", "Closed Won")
- 🔍 **Smart Search**: Filter across all extracted data
- 💾 **Local Storage**: All data stored locally using chrome.storage.local
- 📤 **Export**: Export as CSV (per entity) or JSON (all data)
- 🗑️ **Delete**: Remove individual records or clear all data
- ⚡ **Real-time Sync**: Updates across all extension contexts
- 🎨 **Shadow DOM**: Isolated visual feedback during extraction
- 🚀 **Built with Modern Stack**: React 19, Tailwind CSS 4, Vite 7, Manifest V3

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Google Chrome browser
- Monday.com account (free trial works)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Data-Extractor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

5. **Verify installation**
   - You should see the "Monday.com CRM Extractor" extension
   - The extension icon will appear in your toolbar

## 📦 Storage Schema

- {
    "contacts": [],
    "deals": [],
    "leads": [],
    "activities": [],
    "lastSync": {
      "contacts": null,
      "deals": null,
      "leads": null,
      "activities": null
    }
  }


## DOM selection strategy

- Monday.com’s UI presents a technical challenge due to its reliance on random (or so it seems) class names and React-based virtualized rendering. To address this, the DOM detection strategy is layered and column-driven.
- The extractor targets Monday’s internal col-identifier-* attributes and data-testid markers instead of positional DOM traversal. This ensures reliable data extraction across React-virtualized boards, different view modes, and UI updates, while not depending on class names.


