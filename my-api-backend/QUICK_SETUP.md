# Quick Setup Guide for Render Backend

## ✅ What I Fixed:

1. **Dockerfile Updated:**
   - ✅ Apache DocumentRoot now points to `/var/www/html/public`
   - ✅ Auto-generates APP_KEY if not provided
   - ✅ Runs database migrations automatically
   - ✅ Optimizes Laravel (config, route, view cache)
   - ✅ Supports both MySQL and SQLite

2. **Generated APP_KEY:**
   ```
   base64:TfvBYO5xbBvarm02DfPnxWEy4dAxrMzwgrasZ7Ql7Po=
   ```

3. **Created Documentation:**
   - See `RENDER_ENV_VARS.md` for complete environment variables list

---

## 🚀 Next Steps:

### Step 1: Set Environment Variables in Render

Go to your Render dashboard → **new-business-deploy** → **Environment** and add:

**Minimum Required (Quick Start with SQLite):**
```
APP_KEY=base64:TfvBYO5xbBvarm02DfPnxWEy4dAxrMzwgrasZ7Ql7Po=
APP_ENV=production
APP_DEBUG=false
APP_URL=https://new-business-deploy.onrender.com
FRONTEND_URL=https://your-netlify-app.netlify.app
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
LOG_CHANNEL=stack
LOG_LEVEL=warning
SANCTUM_STATEFUL_DOMAINS=your-netlify-app.netlify.app
CORS_ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
```

**Replace `your-netlify-app` with your actual Netlify domain!**

### Step 2: Add Google OAuth (if using social login)
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://new-business-deploy.onrender.com/auth/google/callback
```

### Step 3: Commit & Push Changes
```powershell
git add .
git commit -m "Fix Laravel deployment: set DocumentRoot, auto-generate APP_KEY, add migrations"
git push
```

### Step 4: Redeploy on Render
- Render will auto-deploy when you push
- OR manually trigger deploy from Render dashboard

### Step 5: Test Your Backend
Once deployed, test:
- https://new-business-deploy.onrender.com/ (should show Laravel welcome page)
- https://new-business-deploy.onrender.com/api/user (should return 401 Unauthenticated)

### Step 6: Update Your Netlify SPA
Add this environment variable to Netlify:
```
REACT_APP_API_BASE=https://new-business-deploy.onrender.com
```

Then redeploy your Netlify app.

---

## 🔍 Troubleshooting:

### Still getting 500 errors?
1. Check Render logs for specific error
2. Verify all environment variables are set
3. Make sure `APP_KEY` is exactly as shown above

### CORS errors?
1. `CORS_ALLOWED_ORIGINS` must match your Netlify URL exactly
2. `SANCTUM_STATEFUL_DOMAINS` should be just the domain (no https://)

### Login not working?
1. Update Google OAuth redirect URI in Google Cloud Console
2. Set `FRONTEND_URL` to your Netlify app URL
3. Check that `SESSION_DRIVER=cookie` is set

---

## 📊 Production-Ready Checklist:

- [ ] All environment variables set in Render
- [ ] APP_KEY generated and set
- [ ] Database configured (SQLite for testing, MySQL for production)
- [ ] CORS and Sanctum domains configured
- [ ] Google OAuth credentials updated
- [ ] Frontend URL set correctly
- [ ] Changes committed and pushed to GitHub
- [ ] Backend deployed and responding
- [ ] Netlify SPA updated with API URL
- [ ] Test login flow end-to-end

---

## 🎯 Quick Commands Reference:

### Generate new APP_KEY locally:
```powershell
cd "f:\Ready Websites\business\Business-Website\New-Business-Deploy\my-api-backend"
php artisan key:generate --show
```

### Test database connection locally:
```powershell
php artisan migrate
```

### Clear Laravel cache locally:
```powershell
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

---

Need help? Check `RENDER_ENV_VARS.md` for detailed explanations!
