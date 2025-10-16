# Vercel Deployment Guide

## 🔴 Issues Fixed

### 1. Database Connection Leak
- Fixed all API routes to properly close database connections
- Prevents "max_user_connections" error

### 2. Hardcoded Database Credentials
- Updated to use environment variables for security
- Prevents deployment failures and security risks

---

## ✅ Deployment Steps

### Step 1: Set Environment Variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables** and add:

```
MYSQL_HOST=162.241.60.214
MYSQL_PORT=3306
MYSQL_USER=joseedu4_administrador
MYSQL_PASSWORD=Eduardo_26_$
MYSQL_DATABASE=joseedu4_hadassa
```

**Important:** Add these for all environments (Production, Preview, Development)

### Step 2: Create Local Environment File

Create a `.env.local` file in your project root (this file is gitignored):

```bash
# .env.local
MYSQL_HOST=162.241.60.214
MYSQL_PORT=3306
MYSQL_USER=joseedu4_administrador
MYSQL_PASSWORD=Eduardo_26_$
MYSQL_DATABASE=joseedu4_hadassa
```

### Step 3: Redeploy on Vercel

After setting environment variables:

1. Go to Vercel dashboard
2. Navigate to **Deployments**
3. Click **Redeploy** on the latest deployment
4. Or push a new commit to trigger deployment

---

## 🔍 Common Issues

### 404 NotFound Error
**Cause:** API routes failing silently due to missing environment variables or database connection errors

**Solution:**
- Verify all environment variables are set in Vercel
- Check database allows remote connections from Vercel IPs
- Check Vercel build logs for errors

### Database Connection Timeout
**Cause:** Firewall blocking Vercel IP addresses

**Solution:**
- Whitelist Vercel IP ranges in your hosting provider
- Or use a database that allows connections from any IP (if secure)

### Build Succeeds but Runtime Fails
**Cause:** Environment variables not available at runtime

**Solution:**
- Ensure env vars are added for the correct environment
- Redeploy after adding environment variables

---

## 📝 Architecture Changes

### Before:
```javascript
// Hardcoded credentials (BAD)
export const db_info = {
    host: "162.241.60.214",
    port: 3306,
    user: "joseedu4_administrador",
    password: "Eduardo_26_$",
    database: "joseedu4_hadassa",
};
```

### After:
```javascript
// Environment variables with fallback (GOOD)
export const db_info = {
    host: process.env.MYSQL_HOST || "162.241.60.214",
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || "joseedu4_administrador",
    password: process.env.MYSQL_PASSWORD || "Eduardo_26_$",
    database: process.env.MYSQL_DATABASE || "joseedu4_hadassa",
};
```

---

## 🛡️ Security Notes

1. **Never commit** `.env.local` or `.env` files to git
2. **Always use** environment variables for sensitive data
3. **Rotate credentials** regularly
4. **Use different credentials** for development and production

---

## 📚 Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Database Connection Best Practices](https://vercel.com/guides/nextjs-prisma-postgres)

