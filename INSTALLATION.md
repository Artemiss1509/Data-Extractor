# 🚀 Quick Installation Guide

## For Reviewers/Evaluators

This guide will help you quickly install and test the Monday.com CRM Data Extractor.

---

## 💻 Prerequisites

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **Google Chrome**: Latest version
- **Monday.com Account**: Free trial works! ([Sign up](https://monday.com/trial))

---

## 🛠️ Installation Steps

### Step 1: Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd Data-Extractor

# Install dependencies
npm install

# Build the extension
npm run build
```

**Expected output:**
```
✓ 49 modules transformed
dist/index.html                          0.46 kB
dist/assets/popup-Bptc5iI-.css          19.47 kB
dist/src/background/service-worker.js    3.53 kB
dist/src/content/content-script.js      17.63 kB
dist/assets/popup-0CvH5-Ak.js          211.67 kB
✓ built in 478ms
```

### Step 2: Load Extension in Chrome

1. Open Chrome and navigate to:
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode** (toggle in top-right corner)

3. Click **"Load unpacked"** button

4. Navigate to and select the **`dist`** folder inside the project

5. You should see:
   - ✅ Extension name: "Monday.com CRM Extractor"
   - ✅ Status: Enabled
   - ✅ Manifest: V3

6. Pin the extension to your toolbar (optional but recommended)

---

## ✅ Verify Installation

### Test 1: Popup Opens
1. Click the extension icon in toolbar
2. You should see a popup (600x500px) with:
   - Purple gradient header
   - "Extract Current Board" button
   - 4 tabs: Contacts, Deals, Leads, Activities

### Test 2: Monday.com Detection
1. Navigate to any website (e.g., google.com)
2. Click extension icon
3. Click "Extract Current Board"
4. You should see: **"Please navigate to a Monday.com board first"**

### Test 3: Console Check (Optional)
1. Navigate to any Monday.com page
2. Open DevTools (F12)
3. Go to Console tab
4. You should see: `🐶 Monday.com CRM Extractor - Content script loaded!`

---

## 🧪 Test Data Setup (5 minutes)

### Option A: Use Existing Data
If you already have Monday.com CRM boards, skip to "Testing" section.

### Option B: Create Test Boards

1. **Log into Monday.com** and create a new workspace

2. **Create a Deals Board:**
   - Click "+" to add board
   - Choose "Sales & CRM" → "Deals"
   - Create groups:
     - "Active Deals"
     - "Closed Won" 
     - "Closed Lost"
   - Add sample deals with:
     - Deal name
     - Value (number column)
     - Stage (status column)
     - Close date (date column)

3. **Create a Contacts Board:**
   - Add board → "Sales & CRM" → "Contacts"
   - Add contacts with:
     - Name
     - Email
     - Phone
     - Company

4. **(Optional) Create Leads & Activities boards** following similar patterns

---

## 🧪 Testing the Extension

### Basic Extraction Test

1. **Navigate to your Deals board** on Monday.com

2. **Open the extension popup** (click icon)

3. **Click "Extract Current Board"**
   - You should see a visual indicator appear on the page
   - It will show: "Detected deals board (table view)"
   - Then: "Extracting deals..."
   - Finally: "Extraction Complete! Successfully extracted X deals"

4. **View extracted data**
   - The popup should refresh automatically
   - Click on the "Deals" tab
   - You should see all your deals listed
   - Notice the group tags (Active Deals, Closed Won, etc.)

5. **Test search**
   - Type in the search bar
   - Results should filter in real-time

6. **Test group filtering**
   - Click on different group pills
   - Deals should filter by group

7. **Test export**
   - Click "Export CSV"
   - A CSV file should download
   - Open it to verify data

### Advanced Tests

#### Test 1: Kanban View
1. Switch your Deals board to Kanban view (Pipeline view)
2. Extract again
3. Verify data is still captured correctly

#### Test 2: Persistence
1. Extract some data
2. Close the popup
3. Refresh the Monday.com page
4. Reopen the popup
5. Data should still be there!

#### Test 3: Multiple Boards
1. Extract from Deals board
2. Navigate to Contacts board
3. Extract from Contacts board
4. Open popup and switch between tabs
5. Both datasets should be present

#### Test 4: Delete
1. Click the 🗑️ icon on any item
2. Confirm deletion
3. Item should disappear

---

## 🐛 Troubleshooting

### Issue: Extension doesn't load
**Solution:**
```bash
# Rebuild the extension
npm run build

# Reload in Chrome
# Go to chrome://extensions/ and click reload icon
```

### Issue: "No module named" errors during build
**Solution:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Extraction doesn't work
**Checks:**
- [ ] Are you on a `*.monday.com/*` URL?
- [ ] Is the board fully loaded? (wait 2-3 seconds)
- [ ] Check browser console (F12) for errors
- [ ] Try refreshing the page and extracting again

### Issue: No data showing in popup
**Solution:**
1. Open Chrome DevTools on the popup:
   - Right-click extension icon
   - Click "Inspect popup"
   - Check Console for errors
2. Try clearing storage:
   ```javascript
   // In popup console
   chrome.storage.local.clear()
   ```
3. Extract data again

### Issue: Extension icon not visible
**Solution:**
- Click the puzzle piece icon in Chrome toolbar
- Find "Monday.com CRM Extractor"
- Click the pin icon to pin it

---

## 📊 Expected Results

After successful extraction, you should see:

### Deals Tab
- Deal cards showing:
  - Name
  - Value (formatted as $X,XXX.XX)
  - Stage
  - Group (as colored pill)
  - Probability (%)
  - Close date
  - Owner
  - Contact
- Group filter pills at top
- Search bar
- Export CSV button
- Last sync timestamp

### Contacts Tab
- Contact cards showing:
  - Name
  - Title
  - Company
  - Email
  - Phone
  - Owner
- Search bar
- Export CSV button

### Other Tabs
- Similar layouts for Leads and Activities
- Empty state if no data extracted yet

---

## 📝 Next Steps

1. ✅ Extension installed and tested
2. ✅ Data extraction working
3. ✅ Popup dashboard functional
4. 📹 **Record demo video** (see DEMO_GUIDE.md)
5. 📚 **Read architecture docs** (see README.md)

---

## 🔗 Useful Links

- **Main README**: [README.md](./README.md) - Full documentation
- **Demo Guide**: [DEMO_GUIDE.md](./DEMO_GUIDE.md) - Video recording guide
- **Monday.com CRM**: [support.monday.com](https://support.monday.com/hc/en-us/articles/115005311909)

---

## ❓ Need Help?

If you encounter any issues:

1. Check the troubleshooting section above
2. Review console logs (F12 → Console)
3. Verify all prerequisites are met
4. Try a clean rebuild:
   ```bash
   npm run build
   ```

---

**Installation should take ~5 minutes. Testing should take ~10 minutes.**

**Happy testing! 🐶🚀**
