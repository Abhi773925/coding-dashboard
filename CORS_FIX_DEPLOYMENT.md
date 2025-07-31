# CORS Fix Deployment Guide

## Issue Description
The production frontend (https://www.prepmate.site) is getting CORS errors when trying to access the backend API (https://prepmate-kvol.onrender.com) because the server was configured only for development origin (http://localhost:5173).

## Files Modified

### 1. `/backend/server.js`
- Updated CORS configuration to use dynamic origin checking
- Added support for multiple allowed origins including production domain
- Added preflight OPTIONS handler for better CORS support

### 2. `/backend/routes/streakroutes.js`
- Updated CORS configuration to match server.js
- Added dynamic origin checking for streak-specific endpoints

### 3. `/backend/routes/analyticsRoutes.js`
- Added CORS middleware with dynamic origin checking
- Supports both development and production domains

### 4. `/backend/.env`
- Updated FRONTEND_URL to production domain
- Added comments for clarity

## Deployment Steps

### For Render.com Deployment:

1. **Update Environment Variables on Render Dashboard:**
   ```
   FRONTEND_URL=https://www.prepmate.site
   BACKEND_URL=https://prepmate-kvol.onrender.com
   ```

2. **Redeploy the Backend:**
   - Push changes to your Git repository
   - Render will automatically redeploy
   - Or manually trigger a redeploy from Render dashboard

3. **Verify CORS Configuration:**
   - Check that all origins are properly allowed
   - Test API endpoints from production frontend

### Environment Variables to Set:

```env
# Production Environment
FRONTEND_URL=https://www.prepmate.site
BACKEND_URL=https://prepmate-kvol.onrender.com
NODE_ENV=production

# For Development (fallback)
# FRONTEND_URL=http://localhost:5173
```

## Testing the Fix

### 1. Test API Endpoints:
```bash
# Test streak endpoint
curl -H "Origin: https://www.prepmate.site" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://prepmate-kvol.onrender.com/api/streak

# Test analytics endpoint
curl -H "Origin: https://www.prepmate.site" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://prepmate-kvol.onrender.com/api/analytics/track
```

### 2. Browser Console Testing:
```javascript
// Test from browser console on https://www.prepmate.site
fetch('https://prepmate-kvol.onrender.com/api/analytics/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    page: 'test',
    action: 'cors-test'
  })
}).then(response => console.log('Success:', response))
  .catch(error => console.error('Error:', error));
```

## Allowed Origins

The server now accepts requests from:
- `https://www.prepmate.site` (Production)
- `http://localhost:5173` (Development)
- `https://coding-dashboard-6lgy.vercel.app` (Alternative deployment)
- Dynamic origin from `FRONTEND_URL` environment variable

## Troubleshooting

### If CORS errors persist:

1. **Check Environment Variables:**
   - Ensure `FRONTEND_URL` is set to `https://www.prepmate.site` on Render
   - Verify the environment variables are properly loaded

2. **Check Server Logs:**
   - Look for "Blocked origin:" messages in Render logs
   - Verify which origins are being blocked

3. **Clear Browser Cache:**
   - Hard refresh the frontend (Ctrl+F5)
   - Clear browser cache and cookies

4. **Verify SSL/HTTPS:**
   - Ensure both frontend and backend are using HTTPS
   - Mixed content (HTTP/HTTPS) can cause CORS issues

### Common Issues:

1. **Environment Variable Not Updated:**
   - Solution: Update `FRONTEND_URL` on Render dashboard and redeploy

2. **Browser Cache:**
   - Solution: Hard refresh or clear cache

3. **Multiple CORS Configurations:**
   - Solution: Ensure route-level CORS doesn't conflict with global CORS

## Monitoring

### Check CORS Headers in Browser DevTools:
- `Access-Control-Allow-Origin`: Should be `https://www.prepmate.site`
- `Access-Control-Allow-Credentials`: Should be `true`
- `Access-Control-Allow-Methods`: Should include `GET, POST, PUT, DELETE, OPTIONS`

### Server Logs to Monitor:
- "Blocked origin:" messages (indicates CORS blocks)
- OPTIONS request handling
- Successful preflight responses

## Next Steps

1. Deploy the updated backend to Render
2. Update environment variables on Render dashboard
3. Test all frontend functionality
4. Monitor for any remaining CORS issues
5. Update any hardcoded API URLs in frontend if needed

The fix ensures the backend accepts requests from the production frontend while maintaining security and supporting both development and production environments.
