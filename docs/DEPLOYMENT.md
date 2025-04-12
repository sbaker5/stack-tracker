# Comprehensive Deployment Guide

## Overview
This guide covers deploying the TagFlagManager component library:
1. GitHub for source code hosting
2. Netlify for hosting the demo/documentation site
3. Cloudflare for DNS and subdomain management

## 1. GitHub Setup

### 1.1 Repository Setup
```bash
# Initialize git if not already done
git init

# Create .gitignore
cat > .gitignore << EOL
node_modules/
dist/
coverage/
.env
.env.local
.DS_Store
*.log
.netlify/
EOL

# Add all files
git add .
git commit -m "Initial commit"
```

### 1.2 GitHub Repository Creation
1. Go to github.com/new
2. Create new repository "stack-tracker"
3. Push existing repository:
```bash
git remote add origin git@github.com:yourusername/stack-tracker.git
git branch -M main
git push -u origin main
```

### 1.3 GitHub Actions Setup
Create `.github/workflows/ci.yml`:
```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm test
    - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run build
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2
      with:
        publish-dir: './dist'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 2. Netlify Setup

### 2.1 Netlify CLI Installation
```bash
npm install netlify-cli -g
netlify login
```

### 2.2 Netlify Project Setup
```bash
# Initialize Netlify project
netlify init

# Select options:
# 1. Create & configure a new site
# 2. Choose team
# 3. Site name: windsurf-components
```

### 2.3 Build Settings in Netlify
Configure in Netlify dashboard or `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2.4 Environment Variables
Set in Netlify dashboard:
1. Go to Site settings > Build & deploy > Environment
2. Add variables:
   - `NODE_ENV=production`
   - Any other required env variables

## 3. Cloudflare Setup

### 3.1 Domain Setup
1. Login to Cloudflare dashboard
2. Add your domain if not already added
3. Update nameservers with your registrar

### 3.2 DNS Configuration
1. Go to DNS > Records
2. Add new CNAME record:
   - Type: CNAME
   - Name: components (for components.yourdomain.com)
   - Target: your-site.netlify.app
   - Proxy status: Proxied

### 3.3 SSL/TLS Configuration
1. Go to SSL/TLS
2. Set mode to "Full (strict)"
3. Enable "Always Use HTTPS"

### 3.4 Page Rules (Optional)
1. Go to Rules > Page Rules
2. Add rules as needed:
   ```
   URL: components.yourdomain.com/*
   Settings:
   - Cache Level: Cache Everything
   - Edge Cache TTL: 4 hours
   ```

## 4. Connecting Everything

### 4.1 Netlify Custom Domain
1. Go to Netlify site settings
2. Add custom domain: components.yourdomain.com
3. Verify DNS configuration

### 4.2 GitHub Secrets
Add to GitHub repository secrets:
1. Go to Settings > Secrets > Actions
2. Add secrets:
   - NETLIFY_AUTH_TOKEN
   - NETLIFY_SITE_ID

### 4.3 Automatic Deployments
1. Ensure Netlify GitHub integration is enabled
2. Configure build hooks if needed
3. Test deployment pipeline

## 5. Post-Deployment Verification

### 5.1 Checklist
- [ ] GitHub Actions passing
- [ ] Netlify build successful
- [ ] Site accessible via custom domain
- [ ] SSL working correctly
- [ ] Performance metrics acceptable
- [ ] All features working as expected

### 5.2 Monitoring Setup
1. Set up Netlify notifications
2. Configure GitHub notifications
3. Set up Cloudflare analytics

### 5.3 Performance Verification
1. Check Lighthouse scores
2. Verify Cloudflare caching
3. Test global performance

## 6. Maintenance

### 6.1 Regular Tasks
- Monitor GitHub Actions
- Check Netlify build logs
- Review Cloudflare analytics
- Update dependencies
- Review security alerts

### 6.2 Troubleshooting
- Check GitHub Actions logs
- Verify Netlify deploy logs
- Review Cloudflare logs
- Test locally if needed

## 7. Local Development

### 7.1 Environment Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### 7.2 Testing Production Build
```bash
# Build
npm run build

# Preview production build
npm run preview
```

## 8. Useful Commands

```bash
# Deploy manually (if needed)
netlify deploy --prod

# Check Cloudflare status
curl -I https://components.yourdomain.com

# Purge Cloudflare cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone-id}/purge_cache" \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
```

## 9. Emergency Procedures

### 9.1 Rollback Deployment
```bash
# Via Netlify CLI
netlify deploy --prod --restore

# Or use Netlify dashboard:
# 1. Go to Deploys
# 2. Find last working deploy
# 3. Click "Publish deploy"
```

### 9.2 DNS Issues
1. Check Cloudflare status
2. Verify DNS propagation
3. Test with different DNS servers

### 9.3 Contact Information
- GitHub Support: support.github.com
- Netlify Support: support.netlify.com
- Cloudflare Support: support.cloudflare.com
