# 🎥 Demo Video Guide (3-5 minutes)

## 📋 Demo Script

### Introduction (30 seconds)
"Hi! This is the Monday.com CRM Data Extractor - a Chrome extension that extracts CRM data from Monday.com boards and displays them in a searchable dashboard."

---

### Part 1: Extension Setup (30 seconds)

1. **Show Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Show the extension is installed
   - Point out Manifest V3

2. **Show Extension Popup**
   - Click extension icon
   - Show the empty dashboard with 4 tabs
   - Explain: "No data yet - we'll extract some!"

---

### Part 2: Deals Board Extraction (1.5 minutes)

1. **Navigate to Monday.com Deals Board**
   - Show a Deals board with multiple groups:
     - "Active Deals"
     - "Closed Won"
     - "Closed Lost"
   - Point out: "Notice the groups and stages"

2. **Extract Data (Table View)**
   - Click extension icon
   - Click "Extract Current Board" button
   - Show the extraction indicator appearing on the page:
     - "Detected deals board (table view)"
     - "Extracting deals..."
     - "Extraction Complete! Successfully extracted X deals"

3. **View Extracted Deals**
   - Open popup again
   - Navigate to Deals tab
   - Show group filters (Active Deals, Closed Won, etc.)
   - Click different groups to filter
   - Point out extracted fields:
     - Deal name
     - Value (formatted as currency)
     - Stage
     - Group context
     - Probability
     - Close date
     - Owner

4. **Search & Filter**
   - Use search bar to filter deals
   - Show real-time filtering

5. **Kanban View (BONUS)**
   - Switch board to Kanban/Pipeline view
   - Extract again
   - Show it works in Kanban view too!

---

### Part 3: Contacts Board Extraction (45 seconds)

1. **Navigate to Contacts Board**
   - Show a Contacts board with data

2. **Extract Contacts**
   - Click "Extract Current Board"
   - Show extraction indicator

3. **View Contacts**
   - Open popup → Contacts tab
   - Show extracted fields:
     - Name
     - Email
     - Phone
     - Account (company)
     - Title
     - Owner
   - Search for a specific contact

---

### Part 4: Persistence & Features (45 seconds)

1. **Refresh Page**
   - Refresh the Monday.com page
   - Reopen extension popup
   - Show data is still there!
   - Point out: "Data persists using chrome.storage.local"

2. **Delete Functionality**
   - Click delete icon (🗑️) on a contact
   - Confirm deletion
   - Show it's removed

3. **Export Features**
   - Click "Export CSV" on Deals tab
   - Show CSV downloads
   - Click "Export All (JSON)"
   - Show JSON downloads
   - Briefly open CSV in spreadsheet to show clean data

---

### Part 5: Dashboard Features (30 seconds)

1. **Switch Between Tabs**
   - Show Contacts, Deals, Leads, Activities tabs
   - Point out item counts in badges
   - Show last sync timestamps

2. **Real-time Sync (BONUS)**
   - Open popup in 2 browser windows
   - Extract data in one window
   - Show it updates in the other window automatically

---

### Conclusion (30 seconds)

"This extension demonstrates:"
- ✅ Multi-board CRM extraction
- ✅ Group context preservation (Active Deals, Won, Lost)
- ✅ Both Table and Kanban view support
- ✅ Local storage with deduplication
- ✅ React dashboard with search & filters
- ✅ Export to CSV/JSON
- ✅ Chrome Manifest V3 architecture
- ✅ Shadow DOM visual feedback

"All without using Monday.com's API - pure DOM scraping!"

"Thanks for watching! 🐶"

---

## 🎬 Camera Angles & Tips

### Screen Recording Settings
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 FPS
- **Cursor**: Show cursor with highlights
- **Audio**: Clear narration, no background music needed

### What to Show
1. **Extension popup** - Record at 600x500 size (full popup)
2. **Monday.com board** - Full browser window
3. **Extraction indicator** - Zoom in slightly when it appears
4. **Downloaded files** - Quick peek at CSV/JSON content

### Pacing
- Speak clearly and not too fast
- Pause briefly after each feature
- Use natural mouse movements (not too quick)
- Highlight key features with circles/arrows (optional)

---

## 📊 Test Data Setup

### Before Recording:

1. **Create Deals Board with Groups:**
   ```
   Group: Active Deals
   - Enterprise Q1 Deal | $50,000 | Negotiation | 75%
   - SMB Expansion | $15,000 | Proposal | 50%
   
   Group: Closed Won
   - Annual Contract | $100,000 | Won | 100%
   
   Group: Closed Lost
   - Competitor Win | $25,000 | Lost | 0%
   ```

2. **Create Contacts Board:**
   ```
   - John Doe | CEO | Acme Corp | john@acme.com | 555-1234
   - Jane Smith | CTO | Tech Inc | jane@tech.com | 555-5678
   - Bob Johnson | VP Sales | StartupCo | bob@startup.com | 555-9012
   ```

3. **Create Leads Board:**
   ```
   - Potential Client | Tech Startup | Qualified | lead@startup.com
   - New Inquiry | Enterprise Co | New | inquiry@enterprise.com
   ```

4. **Create Activities Board:**
   ```
   - Discovery Call | Call | 01/15/2024 | John Doe
   - Demo Scheduled | Meeting | 01/20/2024 | Jane Smith
   ```

---

## ✅ Pre-Recording Checklist

- [ ] Extension is loaded and working
- [ ] Monday.com test boards are set up
- [ ] Chrome window is clean (close unnecessary tabs)
- [ ] Clear existing extension data for fresh demo
- [ ] Test extraction on each board type once
- [ ] Screen recording software is ready
- [ ] Microphone is working
- [ ] Script is practiced
- [ ] Timer is ready (aim for 3-5 minutes)

---

## 🎤 Narration Tips

### Key Phrases to Use:
- "Notice how it captures the group context..."
- "The extension automatically detects the board type..."
- "Data persists even after page refresh..."
- "Works in both table and Kanban views..."
- "Real-time search and filtering..."
- "Clean export to CSV and JSON..."

### Avoid:
- Long pauses
- Technical jargon
- Apologizing for anything
- Going into too much code detail

---

## 📝 Fallback Plan

If Monday.com changes their UI during demo:
- Have screenshots ready
- Pre-record critical sections
- Use voiceover on recorded segments
- Explain: "Monday.com's UI may vary, but the extraction logic adapts"

---

Good luck! 🚀
