# 🚀 Guptify Deployment Guide

## Deploy to Vercel

### Option 1: Automatic Deployment (Recommended)

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your `guptify-frontend` repository

2. **Configure Environment Variables**:
   In your Vercel project settings, add these environment variables:
   ```
   VITE_SUPABASE_URL=https://gfazfolhlvqijkaxstbi.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYXpmb2xobHZxaWprYXhzdGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODgwNDksImV4cCI6MjA2ODg2NDA0OX0.Y_WY2d2c1VX3pqYf2Pm5SA99CKQFNtuhp4wnKsCiDTk
   VITE_API_URL=https://your-backend-api-url.com
   ```
   
   **Important**: Replace `VITE_API_URL` with your actual backend API URL when you deploy your backend.

3. **Deploy**:
   - Vercel will automatically build and deploy your project
   - Your app will be available at `https://your-project-name.vercel.app`

### Option 2: CLI Deployment

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

## ✅ What's Already Configured

- ✅ `vercel.json` configuration file
- ✅ Build scripts in `package.json`
- ✅ Environment variable structure
- ✅ SPA routing configuration
- ✅ Production-ready build setup

## 🔧 Post-Deployment

After deployment, make sure to:

1. **Update your backend CORS settings** to include your Vercel domain
2. **Test all functionality** on the live site
3. **Update any hardcoded URLs** in your backend to point to the production API

## 🌟 Your Guptify App Features

- 🔐 Secure authentication
- 📁 File upload and management
- 📂 Folder organization
- 🔍 Advanced search
- 🗑️ Trash management
- 📱 Mobile-responsive design
- ✨ Modern, user-friendly interface

Your secret cloud space is ready to deploy! 🎉