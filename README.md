# 🎲 LudoWins - Real-Money Ludo Gaming Platform (India-Focused)

LudoWins is a modern, high-performance real-money gaming platform designed for the Indian market. It features a robust backend, a premium admin dashboard, and a low-latency real-time multiplayer component using specialized socket synchronization.

---

## 🚀 Key Features
- **Real-Time Multiplayer**: Low-latency gameplay powered by dedicated Socket.io servers.
- **Premium Admin Dashboard**: Comprehensive management of users, challenges, earnings, and system settings.
- **Secure Payments**: Integrated with popular Indian payment gateways (Razorpay, Cashfree).
- **Modern UI/UX**: White-based premium design with vibrant Ludo-green and amber accents.
- **Responsive Experience**: Optimized for mobile and desktop gameplay.
- **PWA Ready**: Installable web app for a seamless user experience.

---

## 🛠️ Technology Stack

| Component | Technology | Version | Key Libraries |
| :--- | :--- | :--- | :--- |
| **Frontend** | React.js | 18.3.1 | Redux, Axios, Socket.io-client, React Icons |
| **Admin Panel** | React.js | 16.9.0 | Bootstrap 4, Ant Design, Chart.js, CountUp |
| **Backend API** | Node.js / Express | 1.0.0 | MongoDB / Mongoose, Firebase Admin, Bcrypt |
| **Socket Server** | Node.js / Socket.io | 12.0.0 | Express, Mongoose, JSON Web Token |

---

## 📂 Project Structure

The project is organized into four main components for scalability and ease of maintenance:

```bash
Ludo-Wins/
├── lodo-frontend-main/     # Mobile-optimized user interface (Port 3010)
├── admin-bkp-main/         # Premium administration panel (Port 3000)
├── backend-api-main/       # Core REST API for business logic (Port 7010)
└── playsocket-bkp-main/    # Real-time game synchronization server
```

---

## ⚙️ Installation & Setup

### **1. Prerequisites**
- Node.js (v14+ recommended)
- MongoDB Database
- Firebase Service Account (for Firebase-related features)

### **2. Cloning the Repository**
```bash
git clone https://github.com/nkdhawan76/Ludo-By-Nikhil-Dhawan.git
cd Ludo-By-Nikhil-Dhawan
```

### **3. Component Installation**
Run `npm install` in each subdirectory:
```bash
# Install and and start Backend
cd backend-api-main/backend-api-main && npm install && npm run dev

# Install and start Socket Server
cd ../../playsocket-bkp-main/playsocket-bkp-main && npm install && node server.js

# Install and start Admin Panel
cd ../../admin-bkp-main/admin-bkp-main && npm install && npm start

# Install and start Frontend
cd ../../lodo-frontend-main/lodo-frontend-main && npm install && npm start
```

---

## 🌐 Deployment Guide

### **Environment Variables**
Ensure you configure the following in each component's `.env` or `config.js`:
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: Secret key for authentication.
- `REACT_APP_BACKEND_LIVE_API`: Public URL of your backend.
- `REACT_APP_SOCKET_URL`: Public URL of your socket server.

### **Production Build**
To deploy for production, use the build scripts:
```bash
npm run build
```
Serve the static files using `serve` or an Nginx configuration.

---

## ⚖️ License
This project is licensed under the **ISC License**.

---
*Developed with ❤️ for the Indian Gaming Community.*
