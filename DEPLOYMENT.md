# 🚀 Deployment Guide

This guide will help you deploy your Portfolio API to both Render and Vercel.

## 📋 Prerequisites

1. **GitHub Account**: Push your code to GitHub
2. **PostgreSQL Database**: Set up a production database
3. **Render Account**: Sign up at [render.com](https://render.com)
4. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## 🗄️ Database Setup

### Option 1: Render PostgreSQL (Recommended)
1. Go to [render.com](https://render.com)
2. Click "New +" → "PostgreSQL"
3. Configure your database:
   - **Name**: `portfolio-db`
   - **Database**: `portfolio_production`
   - **User**: `portfolio_user`
   - **Plan**: Free (or paid for production)
4. Save the connection details

### Option 2: External PostgreSQL Services
- [PlanetScale](https://planetscale.com) (Free tier available)
- [Railway](https://railway.app) (Free tier available)
- [Supabase](https://supabase.com) (Free tier available)

## 🌐 Deploy to Render

### Step 1: Prepare Your Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `portfolio-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Set Environment Variables
In your Render service dashboard, add these environment variables:

```env
NODE_ENV=production
PORT=10000
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=5432
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Deploy
Click "Create Web Service" and wait for deployment.

**Your app will be available at**: `https://your-app-name.onrender.com`

## ⚡ Deploy to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
# Deploy to Vercel
vercel --prod
```

### Step 3: Set Environment Variables
In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the same environment variables as above

**Your app will be available at**: `https://your-app-name.vercel.app`

## 🔧 Using Deployment Scripts

### Render Deployment
```bash
# Make script executable
chmod +x deploy-render.sh

# Run deployment
./deploy-render.sh
```

### Vercel Deployment
```bash
# Make script executable
chmod +x deploy-vercel.sh

# Run deployment
./deploy-vercel.sh
```

## 🧪 Testing Your Deployment

### Health Check
```bash
curl https://your-app-name.onrender.com/health
curl https://your-app-name.vercel.app/health
```

### API Endpoints
```bash
# Profile
curl https://your-app-name.onrender.com/api/profile

# Skills
curl https://your-app-name.onrender.com/api/skills

# Projects
curl https://your-app-name.onrender.com/api/projects

# Search
curl "https://your-app-name.onrender.com/api/search?q=JavaScript"
```

### Frontend
- **Main App**: `https://your-app-name.onrender.com`
- **Admin Panel**: `https://your-app-name.onrender.com/admin`

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to git
- Use environment variables for all sensitive data
- Rotate database passwords regularly

### CORS Configuration
- Set `CORS_ORIGIN` to your specific domain in production
- Avoid using `*` in production

### Rate Limiting
- Adjust rate limits based on your needs
- Monitor usage and adjust accordingly

## 📊 Monitoring

### Render
- Built-in logging and monitoring
- Automatic restarts on crashes
- Performance metrics

### Vercel
- Function execution logs
- Performance analytics
- Error tracking

## 🔄 Continuous Deployment

Both platforms support automatic deployments:
- **Render**: Deploys on every push to main branch
- **Vercel**: Deploys on every push to main branch

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials
   - Verify database is accessible
   - Check firewall settings

2. **Build Failed**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs for errors

3. **Environment Variables Not Set**
   - Verify all required variables are set
   - Check variable names match exactly
   - Redeploy after setting variables

### Getting Help
- Check platform-specific documentation
- Review build and runtime logs
- Test locally with production environment variables

## 🎉 Success!

Once deployed, your portfolio API will be:
- ✅ Accessible worldwide
- ✅ Automatically scaled
- ✅ Monitored and logged
- ✅ Continuously deployed

Share your portfolio with the world! 🌍
