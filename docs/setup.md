# Stack Tracker Setup Guide

## Prerequisites
- Node.js >= 18
- npm or yarn
- MongoDB Atlas account
- Netlify account (for deployment)
- Cloudflare account (for DNS)

## 1. Clone the Repository
```bash
git clone https://github.com/yourusername/stack-tracker.git
cd stack-tracker
```

## 2. Install Dependencies
```bash
npm install
# or
yarn install
```

## 3. Environment Variables
Create a `.env` file in the root:
```
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
NETLIFY_SITE_ID=your-netlify-site-id
CLOUDFLARE_API_TOKEN=your-cloudflare-token
```

## 4. Running the App
- **Frontend:**
  ```bash
  npm run dev
  ```
- **Backend:**
  ```bash
  npm run start:api
  ```

## 5. Running Tests
```bash
npm test
# or
yarn test
```

## 6. Linting & Formatting
```bash
npm run lint
npm run format
```

## 7. Deployment
- See `/docs/deployment.md` for details
