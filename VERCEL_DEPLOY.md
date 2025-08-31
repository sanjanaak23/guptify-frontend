# 🚀 Deploy Guptify to Vercel - Step by Step

## Quick Deployment (5 minutes)

### Step 1: Go to Vercel
1. Open [vercel.com](https://vercel.com) in your browser
2. Click **"Sign up"** or **"Login"** 
3. Choose **"Continue with GitHub"**

### Step 2: Import Your Project
1. Click **"New Project"** (big blue button)
2. Find **"guptify-frontend"** in your repositories
3. Click **"Import"** next to it

### Step 3: Configure Project
1. **Project Name**: Change to `guptify` (or keep default)
2. **Framework Preset**: Should auto-detect as "Vite" ✅
3. **Root Directory**: Leave as `./` ✅
4. **Build Command**: Should be `npm run build` ✅
5. **Output Directory**: Should be `dist` ✅

### Step 4: Add Environment Variables
Click **"Environment Variables"** and add these **exactly**:

```
Name: VITE_SUPABASE_URL
Value: https://gfazfolhlvqijkaxstbi.supabase.co

Name: VITE_SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYXpmb2xobHZxaWprYXhzdGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODgwNDksImV4cCI6MjA2ODg2NDA0OX0.Y_WY2d2c1VX3pqYf2Pm5SA99CKQFNtuhp4wnKsCiDTk

Name: VITE_API_URL
Value: https://your-backend-api-url.com
```

**Important**: Replace `VITE_API_URL` with your actual backend URL!

### Step 5: Deploy!
1. Click **"Deploy"** 
2. Wait 2-3 minutes for build to complete
3. Get your live URL: `https://guptify-xxx.vercel.app`

## 🎉 Your App is Live!

Once deployed, your Guptify app will have:
- 🔐 Secure authentication 
- 📁 File upload & management
- 📂 Folder organization
- 🔍 Search functionality
- 📱 Mobile-responsive design
- ✨ Beautiful, beginner-friendly UI

## 🔧 Automatic Updates

Every time you push code to your GitHub repository, Vercel will automatically:
- Build your project
- Deploy the updates
- Keep your app live with zero downtime

## 🆘 Need Help?

If you encounter any issues:
1. Check the build logs in Vercel dashboard
2. Verify all environment variables are set correctly
3. Make sure your backend API is accessible from the internet

**Your secret cloud space is ready to go live! 🚀**