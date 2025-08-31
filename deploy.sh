#!/bin/bash

echo "🚀 Deploying Guptify to Vercel..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Ready for Vercel deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Sign in with your GitHub account"
    echo "3. Click 'New Project'"
    echo "4. Import your 'guptify-frontend' repository"
    echo "5. Add the environment variables from your .env file"
    echo "6. Deploy!"
    echo ""
    echo "Your Guptify app will be live in minutes! 🎉"
else
    echo "❌ Build failed. Please check the errors above."
fi