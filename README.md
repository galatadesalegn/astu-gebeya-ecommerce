<div align="center">

<img src="https://img.shields.io/badge/ASTU%20GEBEYA-E--Commerce%20Platform-orange?style=for-the-badge&logo=shopify&logoColor=white" alt="ASTU GEBEYA" />

# 🛒 ASTU GEBEYA

### A high-performance, unified marketplace built with the MERN stack

[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[![Storefront](https://img.shields.io/badge/🌐%20Storefront-Live-brightgreen?style=flat-square)](https://astugebeya.vercel.app)
[![Admin Panel](https://img.shields.io/badge/🛠%20Admin%20Panel-Live-blue?style=flat-square)](https://your-admin-url.vercel.app)
[![API](https://img.shields.io/badge/⚡%20Backend%20API-Live-orange?style=flat-square)](https://your-api-url.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

<br />

[![ASTU GEBEYA Preview](https://res.cloudinary.com/debw95rak/image/upload/w_900,q_auto,f_auto/Screenshot_20260607_114826_q997po)](https://astugebeya.vercel.app)

> 🖱️ *Click the image to visit the live storefront*

</div>

---

## 📖 Overview

**ASTU GEBEYA** is a full-stack e-commerce marketplace platform that connects buyers and sellers in a unified, real-time environment. It features a secure authentication system with OTP verification, a live admin command center, and a polished, responsive storefront — all deployed and production-ready.

---

## ✨ Features

### 🛍️ Storefront
- **Modern UI/UX** — Built with React 19, Tailwind CSS, and Framer Motion animations
- **Unified Marketplace** — Browse and filter products with advanced search functionality
- **Real-Time Chat** — Instant buyer-seller messaging powered by Socket.io
- **Secure Authentication** — JWT-based login & registration with mandatory email OTP verification
- **Seamless Navigation** — Consistent "Back to Home" flow from all auth screens

### ⚡ Admin Command Center
- **Real-Time Monitoring** — Live feed of flagged chats and pending product reviews
- **Analytics Dashboard** — Revenue streams and sales performance charts
- **Chat Moderation** — Monitor and flag inappropriate buyer-seller interactions
- **Inventory Control** — Approve, reject, or remove marketplace listings instantly

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express 5, Socket.io |
| **Database** | MongoDB Atlas |
| **Storage** | Cloudinary (Image hosting) |
| **Security** | Helmet, HPP, Rate Limiting, NoSQL Injection Protection |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- npm or yarn
- MongoDB Atlas account
- Cloudinary account

### Local Setup

**1. Clone the repository**
```bash
git clone https://github.com/your-username/astu-gebeya.git
cd astu-gebeya
```

**2. Install dependencies** (run in each directory)
```bash
# Root
npm install

# Backend
cd backend && npm install

# Storefront
cd ../frontend && npm install

# Admin Panel
cd ../admin-panel && npm install
```

**3. Configure environment variables**

Create a `.env` file in `/backend`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in both `/frontend` and `/admin-panel`:
```env
VITE_BACKEND_URL=http://localhost:5000
```

**4. Start the development servers**
```bash
# From root (if concurrently is configured)
npm run dev

# Or run each separately
cd backend && npm run dev
cd frontend && npm run dev
cd admin-panel && npm run dev
```

---

## ☁️ Deployment

### Backend → Render

Set the following environment variables in your **Render Dashboard**:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
TRUST_PROXY=true
FRONTEND_URL=https://your-storefront-url.vercel.app
ADMIN_URL=https://your-admin-url.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Frontend & Admin → Vercel

Set the following in each project's **Vercel Project Settings → Environment Variables**:

```env
VITE_BACKEND_URL=https://your-backend-url.onrender.com
```

---

## 🔒 Security

- **CORS**: Restricted to specific Vercel deployment URLs only
- **Headers**: Hardened via `helmet` middleware; stack traces disabled in production
- **Rate Limiting**: API endpoints protected against abuse
- **NoSQL Injection**: Input sanitization on all database queries
- **Sockets**: Configured with secure credentials and production-only origin policy

---

## 📁 Project Structure

```
astu-gebeya-ecommerce-platform/
├── admin-panel/              # React Admin Dashboard (Vercel)
│   ├── public/               # Static assets (logos, images)
│   ├── src/
│   │   ├── components/       # Reusable UI (Sidebar, Navbar, Modals)
│   │   ├── context/          # Admin & Theme state management
│   │   ├── pages/            # Dashboard, Users, Products, Chats, Reports
│   │   ├── services/         # API configuration (Axios)
│   │   └── App.jsx           # Protected Admin routing
│   ├── vercel.json           # Vercel deployment config
│   └── vite.config.js        # Vite configuration
│
├── backend/                  # Node.js Express API (Render)
│   ├── config/               # Database (MongoDB) connection
│   ├── controllers/          # Business logic (Auth, Products, Orders, Chat)
│   ├── middleware/           # Security, Auth, Rate Limiting, Error Handling
│   ├── models/               # Mongoose schemas (User, Product, Message, Order)
│   ├── routes/               # Express API endpoints
│   ├── utils/                # Admin seeder, Email helpers (Nodemailer)
│   ├── server.js             # Entry point & Socket.io setup
│   └── .env                  # Production environment variables
│
├── frontend/                 # React Storefront (Vercel)
│   ├── public/               # Hero images and marketplace assets
│   ├── src/
│   │   ├── assets/           # React SVGs and local images
│   │   ├── components/       # Landing, Navbar, Footer, UI Modals
│   │   ├── context/          # Auth, Cart, and Theme state
│   │   ├── pages/            # Home, Collection, Product Details, Chat, Checkout
│   │   ├── services/         # API configuration (Axios)
│   │   └── App.jsx           # Storefront routing
│   ├── vercel.json           # Vercel deployment config
│   └── vite.config.js        # Vite configuration (Tailwind setup)
│
└── README.md                 # Project documentation
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Built with ❤️ using the MERN Stack

</div>