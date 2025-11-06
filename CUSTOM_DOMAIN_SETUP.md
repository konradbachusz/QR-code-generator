# Custom Domain Setup Guide for qr-generator.co.uk

## Overview

You're setting up `qr-generator.co.uk` to point to your GitHub Pages site. The error you're seeing means the DNS records need to be configured.

## Step-by-Step Setup

### Step 1: Configure DNS Records at names.co.uk

You need to add DNS records to point your domain to GitHub Pages servers.

#### Option A: Using Apex Domain (qr-generator.co.uk)

If you want to use the root domain (without www):

1. **Log into names.co.uk**
   - Go to your domain management panel
   - Find DNS settings or DNS management

2. **Add A Records** (IPv4 addresses for GitHub Pages):

   Add these **4 A records** pointing to GitHub's servers:
   ```
   Type: A
   Name: @ (or leave blank for root domain)
   Value: 185.199.108.153
   TTL: 3600 (or 1 hour)

   Type: A
   Name: @
   Value: 185.199.109.153
   TTL: 3600

   Type: A
   Name: @
   Value: 185.199.110.153
   TTL: 3600

   Type: A
   Name: @
   Value: 185.199.111.153
   TTL: 3600
   ```

3. **Add AAAA Records** (IPv6 - Optional but recommended):
   ```
   Type: AAAA
   Name: @
   Value: 2606:50c0:8000::153
   TTL: 3600

   Type: AAAA
   Name: @
   Value: 2606:50c0:8001::153
   TTL: 3600

   Type: AAAA
   Name: @
   Value: 2606:50c0:8002::153
   TTL: 3600

   Type: AAAA
   Name: @
   Value: 2606:50c0:8003::153
   TTL: 3600
   ```

#### Option B: Using www Subdomain (www.qr-generator.co.uk)

If you prefer using www:

1. **Add CNAME Record**:
   ```
   Type: CNAME
   Name: www
   Value: konradbachusz.github.io
   TTL: 3600
   ```

2. **Add A Records for apex domain** (to redirect to www):
   - Same 4 A records as Option A above

#### Recommended: Support Both (apex and www)

To support both `qr-generator.co.uk` AND `www.qr-generator.co.uk`:

1. Add all 4 **A records** (from Option A)
2. Add the **CNAME record** for www (from Option B)

### Step 2: Update Your Repository

The CNAME file has been created for you. Now push it to GitHub:

```bash
git add CNAME
git commit -m "Add custom domain configuration"
git push origin main
```

### Step 3: Configure GitHub Pages

1. **Go to your repository on GitHub**:
   - https://github.com/konradbachusz/QR-code-generator

2. **Navigate to Settings**:
   - Click **Settings** tab
   - Click **Pages** in the left sidebar

3. **Set Custom Domain**:
   - Under "Custom domain", enter: `qr-generator.co.uk`
   - Click **Save**
   - Wait for DNS check (can take a few minutes)

4. **Enable HTTPS** (after DNS propagates):
   - Check the box "Enforce HTTPS"
   - This may take up to 24 hours to become available

### Step 4: Wait for DNS Propagation

DNS changes can take time to propagate:
- **Minimum**: 5-10 minutes
- **Typical**: 1-4 hours
- **Maximum**: 48 hours (rare)

### Step 5: Verify DNS Configuration

Check if your DNS is configured correctly:

**Command Line (Windows PowerShell):**
```powershell
nslookup qr-generator.co.uk
```

**Expected output should show:**
```
Non-authoritative answer:
Name:    qr-generator.co.uk
Addresses:  185.199.108.153
            185.199.109.153
            185.199.110.153
            185.199.111.153
```

**Online Tools:**
- https://dnschecker.org/
- Enter `qr-generator.co.uk`
- Check if A records point to GitHub IPs

### Step 6: Update Vite Configuration

Since you're using a custom domain, you may want to update the base path:

**File: `vite.config.js`**

**Current (for GitHub Pages subdomain):**
```javascript
base: '/QR-code-generator/',
```

**Update to (for custom domain):**
```javascript
base: '/',
```

This is because custom domains serve from the root, not a subdirectory.

## Common Issues & Solutions

### Issue 1: "Domain does not resolve to GitHub Pages server"

**Cause:** DNS records not configured or not propagated yet

**Solutions:**
1. Verify A records are added correctly at names.co.uk
2. Wait 10-30 minutes for DNS propagation
3. Clear DNS cache: `ipconfig /flushdns` (Windows)
4. Try again in 1-2 hours

### Issue 2: "DNS check unsuccessful"

**Cause:** DNS hasn't propagated yet or wrong records

**Solutions:**
1. Double-check A record values match GitHub's IPs exactly
2. Ensure you're editing the correct domain
3. Wait longer (up to 24 hours)
4. Contact names.co.uk support if stuck

### Issue 3: Site shows 404 error

**Cause:** CNAME file missing or base path incorrect

**Solutions:**
1. Verify CNAME file exists in repository root
2. Check vite.config.js has correct base path
3. Rebuild and redeploy

### Issue 4: SSL/HTTPS not working

**Cause:** GitHub is provisioning SSL certificate

**Solutions:**
1. This is normal - takes up to 24 hours
2. Uncheck "Enforce HTTPS" temporarily
3. Re-check it after 24 hours
4. Ensure DNS is fully propagated first

### Issue 5: www not working (or vice versa)

**Cause:** Missing CNAME record or A records

**Solutions:**
1. Add both A records AND CNAME record
2. In GitHub Pages settings, you can only set one primary domain
3. GitHub will automatically redirect the other

## DNS Records Summary (Copy-Paste Ready)

For names.co.uk DNS management panel:

```
# A Records (Required)
Type: A    | Name: @   | Value: 185.199.108.153 | TTL: 3600
Type: A    | Name: @   | Value: 185.199.109.153 | TTL: 3600
Type: A    | Name: @   | Value: 185.199.110.153 | TTL: 3600
Type: A    | Name: @   | Value: 185.199.111.153 | TTL: 3600

# CNAME Record (Optional, for www)
Type: CNAME | Name: www | Value: konradbachusz.github.io | TTL: 3600
```

## Verification Checklist

Before contacting support, verify:

- [ ] All 4 A records added at names.co.uk
- [ ] Values match GitHub's IPs exactly
- [ ] CNAME file exists in repository
- [ ] CNAME file contains only: `qr-generator.co.uk`
- [ ] Changes pushed to GitHub (git push)
- [ ] Custom domain set in GitHub Pages settings
- [ ] Waited at least 1 hour for DNS propagation
- [ ] Cleared browser cache and DNS cache
- [ ] vite.config.js base path updated to `/`

## Testing Your Setup

Once DNS propagates, test:

1. **Visit your domain:**
   - http://qr-generator.co.uk
   - http://www.qr-generator.co.uk

2. **Both should:**
   - Load your QR generator site
   - Redirect to one canonical URL

3. **After HTTPS is enabled:**
   - https://qr-generator.co.uk
   - Should have green padlock icon

## Timeline

**Immediate (0-5 minutes):**
- Create CNAME file ✓
- Push to GitHub ✓
- Add DNS records at names.co.uk

**Short wait (10-60 minutes):**
- DNS propagation starts
- GitHub detects DNS records
- Domain verification passes

**Longer wait (1-24 hours):**
- DNS fully propagated worldwide
- SSL certificate provisioned
- HTTPS available

## Need Help?

**Check DNS Propagation:**
- https://www.whatsmydns.net/
- Enter: qr-generator.co.uk
- Type: A
- Should show GitHub IPs

**GitHub Pages Documentation:**
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

**names.co.uk Support:**
- If DNS settings are confusing, contact their support
- Ask them to: "Point qr-generator.co.uk to GitHub Pages"
- Give them the 4 A record IPs listed above

## After DNS Propagates

Once working:

1. Update base path in vite.config.js to `/`
2. Rebuild: `npm run build`
3. Push changes: `git push`
4. Enable "Enforce HTTPS" in GitHub Pages settings
5. Update all links/documentation to use new domain

---

**Current Status:**
- ✅ CNAME file created
- ⏳ Need to configure DNS at names.co.uk
- ⏳ Need to wait for propagation
- ⏳ Need to update vite.config.js base path
