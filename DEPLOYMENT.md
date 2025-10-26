# Smart LINE - Deployment Guide

## 🚀 Quick Deployment Steps

### 1. **Prepare MongoDB Atlas**
- Your MongoDB is already set up ✅
- Copy your connection string

### 2. **Deploy Backend (Render.com - FREE)**

1. Go to https://render.com and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `smartline-backend`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:**
     - `MONGODB_URI` = `mongodb+srv://...` (your connection string)
     - `JWT_SECRET` = `your-secret-key-123`
     - `NODE_ENV` = `production`

5. Click **"Create Web Service"**
6. Copy the deployed URL (e.g., `https://smartline-backend.onrender.com`)

### 3. **Deploy Frontend (Render.com - FREE)**

1. In Render, click **"New +"** → **"Static Site"**
2. Connect same GitHub repo
3. Configure:
   - **Name:** `smartline-frontend`
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
   - **Environment Variables:**
     - `REACT_APP_API_URL` = `https://smartline-backend.onrender.com` (your backend URL)

4. Click **"Create Static Site"**

### 4. **Update Client Code**

Update axios baseURL to use environment variable:
- In all API calls, replace `/api/...` with `${process.env.REACT_APP_API_URL}/api/...`

### 5. **Update Server CORS**

Add your frontend URL to CORS allowed origins in `server.js`

---

## 🌐 Alternative Hosting Options

### **Vercel (Frontend) + Render (Backend)**
- **Frontend:** Deploy to Vercel (faster builds)
- **Backend:** Deploy to Render

### **Railway.app (Full Stack)**
- Deploy both frontend and backend on Railway
- Easy setup, free tier available

### **Heroku (Paid)**
- More reliable but requires payment

---

## 📦 **Before Deployment Checklist:**

- [ ] MongoDB Atlas is accessible from anywhere (0.0.0.0/0)
- [ ] Environment variables are ready
- [ ] Code is pushed to GitHub
- [ ] Update CORS settings
- [ ] Update API URLs in frontend
- [ ] Test locally in production mode: `npm run build`

---

## 🔒 **Security Notes:**

- Never commit `.env` files to GitHub
- Use strong JWT_SECRET
- MongoDB user should have proper permissions
- Enable HTTPS (handled automatically by Render/Vercel)

---

## ⚡ **Free Tier Limits:**

**Render.com:**
- Spins down after 15 minutes of inactivity
- First request might be slow (cold start)
- 750 hours/month free

**Vercel:**
- 100 GB bandwidth/month
- Unlimited deployments

---

## 📞 **Need Help?**

If you run into issues during deployment, let me know which hosting platform you choose and I'll help you configure it!
