# 96-Well Plate Planner - Installation & Deployment Guide

## What You Have

Complete files for a Progressive Web App (PWA) that works on desktop, tablet, and mobile:

- `index.html` - Main page with the plate layout
- `app.js` - All the application logic
- `service-worker.js` - For offline support
- `manifest.json` - For app installation
- `README.md` - This file

## Quick Start (Local Testing)

### Option 1: Python (Mac/Linux/Windows)
```bash
# Navigate to the folder with the files
cd /path/to/plate-planner

# Python 3
python -m http.server 8000

# OR Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### Option 2: Node.js
```bash
# Install http-server globally (one time)
npm install -g http-server

# Run it
http-server

# Then open: http://localhost:8080
```

---

## Deploy to the Web (FREE OPTIONS)

### **Option A: GitHub Pages** (Recommended - Easiest)

1. **Create GitHub account** → https://github.com/signup
2. **Create new repository** named `plate-planner`
3. **Upload files:**
   - Click "Add file" → "Upload files"
   - Select all 5 files (index.html, app.js, service-worker.js, manifest.json, README.md)
4. **Enable GitHub Pages:**
   - Settings → Pages → Source → Deploy from branch → Main → Save
5. **Your app is live at:**
   ```
   https://yourusername.github.io/plate-planner
   ```
6. **Share this link with colleagues!**

---

### **Option B: Netlify** (Drag & Drop)

1. Go to https://netlify.com
2. **Sign up with GitHub** (easiest)
3. **Drag and drop your folder** onto the Netlify dashboard
4. **Your app is live instantly** (Netlify generates a URL)
5. **Customize the URL** if you want

---

### **Option C: Vercel** (Professional)

1. Go to https://vercel.com
2. **Sign up with GitHub**
3. **Import your repository**
4. **Deploy** (automatic)
5. Get a professional URL like `plate-planner.vercel.app`

---

## Features Included

✅ **96-well plate layout** (8 rows A-H, 12 columns 1-12)
✅ **Multiple sample types** (Control, Treatments, Blank, Standard, QC)
✅ **Color-coded visualization** - see your layout at a glance
✅ **Click to assign** - select wells interactively
✅ **Save as PDF** - download printable layouts
✅ **Export as TXT** - data file for your records
✅ **Print support** - optimized for A4 paper
✅ **Offline support** - works without internet (after first visit)
✅ **Mobile app install** - works like a native app on phone
✅ **Auto-save** - your layout saves automatically

---

## Install on Your Phone

Once deployed:

### **iPhone/iPad:**
1. Open app in Safari
2. Tap Share (bottom)
3. Tap "Add to Home Screen"
4. Tap "Add"
5. Now it's on your home screen like an app!

### **Android:**
1. Open app in Chrome
2. Tap menu (⋮)
3. Tap "Install app"
4. Tap "Install"
5. Now it's on your home screen!

---

## File Structure

```
plate-planner/
├── index.html          (Main page)
├── app.js              (Application logic)
├── service-worker.js   (Offline support)
├── manifest.json       (App metadata)
└── README.md           (This file)
```

---

## Customization Ideas

Want to add more features? Open `index.html` in a text editor:

**Add new sample types:**
In `index.html`, find:
```html
<option value="control">Control</option>
```
And add:
```html
<option value="treatment4">Treatment 4</option>
```

Then in `app.js`, add to `colorMap`:
```javascript
treatment4: '#FF6B6B',
```

---

## Troubleshooting

**"The app doesn't work offline"**
- This is normal on first visit. Visit the page once while online, then it caches. After that, it works offline.

**"Can't deploy to GitHub Pages"**
- Make sure files are in root folder (not in a subfolder)
- Check that you enabled GitHub Pages in Settings
- Wait 1-2 minutes for deployment

**"PDF doesn't download"**
- Check your browser settings - it might be blocked
- Try a different browser
- Click "Save as PDF" instead of print

**"Can't install on mobile"**
- Only works on HTTPS (GitHub Pages uses HTTPS ✓)
- Not available in all browsers on desktop

---

## Questions?

1. **How do I update the app?** - Edit files on GitHub, it auto-updates
2. **Is it really free?** - Yes, GitHub Pages is free forever
3. **Can I use my own domain?** - Yes, GitHub Pages supports custom domains
4. **Can colleagues access it?** - Yes, just share the URL

---

## Next Steps

1. **Choose deployment option** (GitHub Pages recommended)
2. **Upload files**
3. **Test on desktop** and **mobile**
4. **Share the link** with your lab

Good luck with your ELISA experiments! 🧪🥚

---

**Created for:** GL @ Volcani Institute / Weizmann Institute
**Research:** Reproductive aging, circadian rhythms, chrono-nutrition in laying hens
