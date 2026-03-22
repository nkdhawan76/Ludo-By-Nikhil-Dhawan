# 🚢 Deployment Guide

This guide provides detailed instructions for setting up and deploying the LudoWins platform in both development and production environments.

## 📋 Prerequisites
- **Node.js**: v16.x or v18.x (Recommended)
- **MongoDB**: v5.0+ (Local or Atlas)
- **Git**: For version control
- **PM2**: (Optional) For process management in production

---

## 🛠️ Local Development Setup

### **1. Backend API (`backend-api-main`)**
```bash
cd backend-api-main/backend-api-main
npm install
# Configure .env or config.js
npm run dev
```
- **Port**: 7010
- **Primary Entry**: `server.js`

### **2. Socket Synchronization Server (`playsocket-bkp-main`)**
```bash
cd playsocket-bkp-main/playsocket-bkp-main
npm install
node server.js
```
- **Connection**: Uses `socket.io` to synchronize game state.

### **3. Admin Panel (`admin-bkp-main`)**
```bash
cd admin-bkp-main/admin-bkp-main
npm install
npm start
```
- **Port**: 3000
- **Note**: Ensure the Backend API reaches this URL for authorization.

### **4. Frontend App (`lodo-frontend-main`)**
```bash
cd lodo-frontend-main/lodo-frontend-main
npm install
npm start
```
- **Port**: 3010
- **Features**: PWA support, mobile-first design.

---

## 🚀 Production Deployment

### **Building State Apps**
For the Admin and Frontend (React apps), generate optimized production builds:
```bash
npm run build
```
The resulting `build/` folder should be served using Nginx or a static host.

### **Nginx Configuration (Example)**
```nginx
server {
    listen 80;
    server_name ludowins.in;

    location / {
        root /var/www/ludo-frontend/build;
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:7010/;
    }

    location /socket.io/ {
        proxy_pass http://localhost:socket_port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

### **Process Management (PM2)**
Use PM2 to ensure the Backend and Socket servers stay alive:
```bash
pm2 start server.js --name ludo-backend
pm2 start server.js --name ludo-socket
pm2 save
```

---

## 🔑 Environment Variables & Config
- **MongoDB**: Set your `MONGODB_URI` in `backend-api-main/config/default.json` or `.env`.
- **Firebase**: JSON credentials for Firebase Admin should be placed in the `backend-api-main` root.
- **Port Management**: If changing ports, update all `baseUrl` references in `admin-bkp-main/src/app/config.js` and `lodo-frontend-main/src/app/config.js`.
