# Google AdSense Setup Guide

This guide explains how to monetize your QR Code Generator with Google AdSense.

## Prerequisites

Before you can add ads, you need:

1. **Google AdSense Account**
   - Apply at: https://www.google.com/adsense
   - Your site needs to be live (deployed) for approval
   - Approval can take a few days to weeks

2. **Your Publisher ID**
   - Format: `ca-pub-XXXXXXXXXXXXXXXXX`
   - Found in your AdSense dashboard under Account → Account Information

## Implementation Steps

### Step 1: Get Your AdSense Publisher ID

1. Log into Google AdSense: https://www.google.com/adsense
2. Go to **Account** → **Settings** → **Account Information**
3. Copy your **Publisher ID** (starts with `ca-pub-`)

### Step 2: Update Configuration Files

Replace `ca-pub-XXXXX` with your actual Publisher ID in these files:

**File: `index.html` (line 12)**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ACTUAL_ID"
     crossorigin="anonymous"></script>
```

**File: `src/AdSense.jsx` (line 35)**
```jsx
data-ad-client="ca-pub-YOUR_ACTUAL_ID"
```

### Step 3: Create Ad Units in AdSense

You need to create 3 ad units in your AdSense dashboard:

1. **Top Banner Ad** (970x90 or responsive)
   - Go to **Ads** → **By ad unit** → **Display ads** → **Create new ad unit**
   - Name: "QR Generator - Top Banner"
   - Ad size: Responsive or 970x90
   - Copy the **Ad Slot ID** (format: `1234567890`)

2. **Content Banner Ad** (728x90 or responsive)
   - Name: "QR Generator - Content Banner"
   - Ad size: Responsive or 728x90
   - Copy the **Ad Slot ID**

3. **Sidebar Ad** (300x250 or responsive)
   - Name: "QR Generator - Sidebar"
   - Ad size: Responsive or 300x250
   - Copy the **Ad Slot ID**

### Step 4: Replace Ad Placeholders in App.jsx

Find and replace the three ad placeholder sections in `src/App.jsx`:

#### Replace Top Banner (around line 331-336):

**Before:**
```jsx
{/* Advertisement placeholder */}
<div className="bg-gray-100 border-t border-b border-gray-200 py-2">
  <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
    Advertisement Space (970x90)
  </div>
</div>
```

**After:**
```jsx
{/* Top Banner Ad */}
<div className="bg-gray-100 border-t border-b border-gray-200 py-2">
  <div className="max-w-7xl mx-auto px-4 flex justify-center">
    <AdSense
      adSlot="YOUR_TOP_BANNER_AD_SLOT_ID"
      adFormat="horizontal"
      adResponsive={true}
    />
  </div>
</div>
```

#### Replace Content Banner (around line 481-484):

**Before:**
```jsx
{/* Ad Space */}
<div className="bg-gray-100 rounded-xl p-8 border border-gray-200 text-center">
  <p className="text-sm text-gray-500">Advertisement Space (728x90)</p>
</div>
```

**After:**
```jsx
{/* Content Banner Ad */}
<div className="bg-gray-100 rounded-xl p-4 border border-gray-200 flex justify-center">
  <AdSense
    adSlot="YOUR_CONTENT_BANNER_AD_SLOT_ID"
    adFormat="horizontal"
    adResponsive={true}
  />
</div>
```

#### Replace Sidebar Ad (around line 489-493):

**Before:**
```jsx
{/* Sidebar Ad - Sticky means it stays in place while scrolling */}
<div className="bg-gray-100 rounded-xl p-8 border border-gray-200 text-center sticky top-4">
  <p className="text-sm text-gray-500 mb-2">Advertisement</p>
  <p className="text-xs text-gray-400">(300x250)</p>
</div>
```

**After:**
```jsx
{/* Sidebar Ad - Sticky means it stays in place while scrolling */}
<div className="bg-gray-100 rounded-xl p-4 border border-gray-200 flex justify-center sticky top-4">
  <AdSense
    adSlot="YOUR_SIDEBAR_AD_SLOT_ID"
    adFormat="rectangle"
    adResponsive={true}
  />
</div>
```

## Testing

### Before Approval (Development)
- Ads won't show until your AdSense account is approved
- You'll see empty spaces or placeholders
- DO NOT click your own ads (will get you banned!)

### After Approval (Production)
- Deploy to GitHub Pages
- Ads should appear within a few hours
- It may take 24-48 hours for ads to fully activate

## Important Notes

### AdSense Policies

⚠️ **Follow these rules to avoid account suspension:**

1. **Never click your own ads**
   - Don't test by clicking
   - Don't ask others to click
   - Don't use click bots

2. **Content Requirements**
   - Must have original content
   - Must provide value to users
   - No prohibited content (see AdSense policies)

3. **Traffic Requirements**
   - Need real, organic traffic
   - No fake traffic or bots
   - Quality over quantity

4. **Technical Requirements**
   - Site must be live and accessible
   - Must have privacy policy
   - Must comply with GDPR (if EU traffic)

### Optimization Tips

1. **Ad Placement**
   - Above the fold performs better
   - Near content users engage with
   - Not too many ads (current setup is good)

2. **Responsive Ads**
   - Use responsive ad formats
   - Better for mobile users
   - AdSense optimizes automatically

3. **Performance**
   - Ads load asynchronously (won't slow down site)
   - Use lazy loading for below-fold ads

## Troubleshooting

### Ads Not Showing

1. **Check Publisher ID**
   - Verify it's correct in both files
   - Format: `ca-pub-XXXXXXXXXXXXXXXXX`

2. **Check Ad Slot IDs**
   - Verify they match your AdSense dashboard
   - Should be just numbers

3. **Check Console Errors**
   - Open browser DevTools (F12)
   - Look for AdSense-related errors

4. **Wait for Activation**
   - New ad units take time to activate
   - Can take up to 24 hours

### Low Earnings

1. **Increase Traffic**
   - SEO optimization
   - Social media promotion
   - Quality content

2. **Improve User Engagement**
   - Make users spend more time on site
   - Add useful features
   - Good UX design

3. **Geographic Targeting**
   - US/UK/Canada traffic pays more
   - Optimize for valuable markets

## Additional Resources

- **AdSense Help Center**: https://support.google.com/adsense
- **AdSense Policies**: https://support.google.com/adsense/answer/48182
- **AdSense Best Practices**: https://support.google.com/adsense/answer/17957

## Need to Add Privacy Policy?

Google AdSense requires a privacy policy. Create a new page explaining:
- What data you collect (AdSense cookies)
- How you use it (showing relevant ads)
- User rights (opt-out options)
- GDPR compliance (if applicable)

You can use free privacy policy generators:
- https://www.privacypolicygenerator.info/
- https://www.freeprivacypolicy.com/

## Summary

1. ✅ AdSense script added to `index.html`
2. ✅ AdSense component created in `src/AdSense.jsx`
3. ✅ Import added to `src/App.jsx`
4. ⏳ Replace `ca-pub-XXXXX` with your Publisher ID
5. ⏳ Create ad units in AdSense dashboard
6. ⏳ Replace ad placeholders with AdSense components
7. ⏳ Deploy and wait for approval

Good luck with monetization! 🚀
