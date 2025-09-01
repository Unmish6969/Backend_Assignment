#!/bin/bash

echo "🚀 Deploying to Render..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Check if remote exists
if ! git remote get-url render 2>/dev/null; then
    echo "Please add your Render git remote:"
    echo "git remote add render https://git.render.com/your-username/your-repo-name.git"
    exit 1
fi

# Build and deploy
echo "Building and deploying..."
git add .
git commit -m "Deploy to Render - $(date)"
git push render main

echo "✅ Deployment to Render completed!"
echo "🌐 Your app will be available at: https://your-app-name.onrender.com"
