#!/bin/bash

echo "🚀 Deploying to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "Deploying..."
vercel --prod

echo "✅ Deployment to Vercel completed!"
echo "🌐 Your app will be available at: https://your-app-name.vercel.app"
