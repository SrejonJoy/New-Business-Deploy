# Render Environment Variables Setup

## Required Environment Variables for Render Deployment

Copy these environment variables into your Render web service settings:

### Core Laravel Settings
```
APP_NAME=BusinessWebsite
APP_ENV=production
APP_KEY=base64:TfvBYO5xbBvarm02DfPnxWEy4dAxrMzwgrasZ7Ql7Po=
APP_DEBUG=false
APP_URL=https://new-business-deploy.onrender.com
```

### Frontend URL (for redirects after login)
```
FRONTEND_URL=https://your-netlify-app.netlify.app
```
*Replace with your actual Netlify SPA URL*

### Database Configuration
**Option 1: If you have a database on Render or external service:**
```
DB_CONNECTION=mysql
DB_HOST=your-db-host.render.com
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

**Option 2: If testing without a database (SQLite):**
```
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite
```

### Session & Cache
```
CACHE_DRIVER=file
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_DOMAIN=
```
*Leave SESSION_DOMAIN empty for split-origin (Netlify SPA + Render API)*

### Queue
```
QUEUE_CONNECTION=sync
```

### Logging
```
LOG_CHANNEL=stack
LOG_LEVEL=warning
```

### Sanctum (Authentication)
```
SANCTUM_STATEFUL_DOMAINS=your-netlify-app.netlify.app
```
*Replace with your actual Netlify domain (no https://)*

### CORS (Cross-Origin)
```
CORS_ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
```
*Replace with your actual Netlify URL*

### Mail (Optional - for password resets, notifications)
```
MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@businesswebsite.com
MAIL_FROM_NAME=BusinessWebsite
```

### Google OAuth (Social Login)
```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://new-business-deploy.onrender.com/auth/google/callback
```
*Get these from Google Cloud Console*

---

## How to Set These in Render:

1. Go to your Render dashboard
2. Select your web service: **new-business-deploy**
3. Click **Environment** in the left sidebar
4. Click **Add Environment Variable**
5. Copy each variable name and value from above
6. Click **Save Changes**
7. Render will automatically redeploy

---

## Important Notes:

### 1. APP_KEY
- **Already generated for you:** `base64:TfvBYO5xbBvarm02DfPnxWEy4dAxrMzwgrasZ7Ql7Po=`
- This is used for encryption and must be set
- The Dockerfile now auto-generates one if missing

### 2. Database Setup
- If you don't have a database yet, you have two options:
  - **Option A:** Add a PostgreSQL database in Render (free tier available)
  - **Option B:** Use SQLite for testing (set `DB_CONNECTION=sqlite`)

### 3. Frontend URL
- Replace `https://your-netlify-app.netlify.app` with your actual Netlify URL
- This is where users will be redirected after login

### 4. Google OAuth
- You need to update your Google OAuth redirect URIs to include:
  - `https://new-business-deploy.onrender.com/auth/google/callback`
- Go to Google Cloud Console > APIs & Services > Credentials

### 5. CORS & Sanctum
- Both must include your Netlify SPA URL
- No trailing slashes
- Use the exact domain (include subdomain if any)

---

## Testing After Deployment:

1. Visit: `https://new-business-deploy.onrender.com/api/user` (should return 401 Unauthenticated)
2. Visit: `https://new-business-deploy.onrender.com/` (should show Laravel welcome page or your app)
3. Test login from your Netlify SPA

---

## Troubleshooting:

### If you still get 500 errors:
1. Check Render logs for specific error messages
2. Verify all environment variables are set correctly
3. Make sure database credentials are correct
4. Check that APP_KEY is set

### If CORS errors occur:
1. Double-check `CORS_ALLOWED_ORIGINS` matches your Netlify URL exactly
2. Make sure `SANCTUM_STATEFUL_DOMAINS` is set correctly

### If login doesn't work:
1. Verify `FRONTEND_URL` is set to your Netlify app
2. Check that Google OAuth redirect URI is updated
3. Ensure `SESSION_DRIVER=cookie` is set
