<div align="center">

# 🛒 ShopFlow

### Full-Stack E-Commerce Platform with Real-Time Admin Panel

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Deploy](https://img.shields.io/badge/live-online-brightgreen?style=flat-square)](https://your-live-url.com)

<br/>

> A production-ready e-commerce platform where buyers browse and purchase products, sellers manage listings, and admins monitor everything in real time via a Socket.io-powered dashboard.

<br/>

**[🌐 Live Demo](https://your-live-url.com)** · **[🛠 Admin Panel](https://your-admin-url.com)** · **[🐛 Report Bug](https://github.com/galatadesalegn/shopflow/issues)**

</div>

---

## ✨ Features

### 🛍 Storefront (Buyer)
- Browse products with search, filter, and sort
- Product detail pages with image gallery and reviews
- Shopping cart with persistent state
- Secure checkout with Stripe payment integration
- Order history and tracking
- User authentication (register / login / JWT)

### 🏪 Seller Dashboard
- List, edit, and remove products
- Manage inventory and pricing
- View sales analytics and order history
- Upload product images

### ⚡ Admin Panel (Real-Time)
- Live order feed powered by **Socket.io**
- Real-time inventory alerts when stock runs low
- User management (ban, verify, role assignment)
- Revenue and sales charts
- Broadcast notifications to all connected users

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Admin Panel** | React 18, Recharts, Tailwind CSS |
| **Backend** | Node.js, Express |
| **Real-Time** | Socket.io |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + bcrypt |
| **Payments** | Stripe |
| **File Upload** | Multer + Cloudinary |
| **Deployment** | Vercel (frontend) · Render (backend) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://mongodb.com/) (local or Atlas)
- [Stripe account](https://stripe.com/) for payments
- [Cloudinary account](https://cloudinary.com/) for image uploads

### 1. Clone the repo

```bash
git clone https://github.com/galatadesalegn/shopflow.git
cd shopflow
```

### 2. Install dependencies

```bash
# Backend
cd server && npm install

# Frontend (storefront)
cd ../client && npm install

# Admin panel
cd ../admin && npm install
```

### 3. Configure environment variables

```bash
cd server
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://your_mongo_uri
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### 4. Start all servers

```bash
# Terminal 1 — Backend + Socket.io (http://localhost:5000)
cd server && npm run dev

# Terminal 2 — Storefront (http://localhost:5173)
cd client && npm run dev

# Terminal 3 — Admin panel (http://localhost:5174)
cd admin && npm run dev
```

---

## 📁 Project Structure

```
shopflow/
├── client/                        # Buyer-facing React storefront
│   ├── src/
│   │   ├── components/            # Navbar, ProductCard, Cart, etc.
│   │   ├── pages/                 # Home, Product, Checkout, Orders
│   │   ├── context/               # CartContext, AuthContext
│   │   ├── hooks/                 # useCart, useAuth, useFetch
│   │   └── App.jsx
│   └── vite.config.js
│
├── admin/                         # Real-time admin panel
│   ├── src/
│   │   ├── components/            # Sidebar, StatsCard, OrderFeed
│   │   ├── pages/                 # Dashboard, Products, Users, Orders
│   │   ├── socket/                # Socket.io client setup
│   │   └── App.jsx
│   └── vite.config.js
│
├── server/                        # Node.js + Express + Socket.io
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── users.js
│   ├── socket/
│   │   └── index.js               # Socket.io event handlers
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   └── isAdmin.js
│   ├── .env.example
│   └── index.js
│
└── README.md
```

---

## 🔌 Real-Time Events (Socket.io)

| Event | Direction | Description |
|-------|-----------|-------------|
| `order:new` | Server → Admin | New order placed by a buyer |
| `order:updated` | Server → Admin | Order status changed |
| `inventory:low` | Server → Admin | Product stock below threshold |
| `user:joined` | Server → Admin | New user registered |
| `admin:broadcast` | Admin → All clients | Admin sends site-wide notification |

---

## 🔐 API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Products
```
GET    /api/products              # All products (with filters)
GET    /api/products/:id          # Single product
POST   /api/products              # Create (seller/admin)
PUT    /api/products/:id          # Update (seller/admin)
DELETE /api/products/:id          # Delete (seller/admin)
```

### Orders
```
POST   /api/orders                # Place order (buyer)
GET    /api/orders/my             # My orders (buyer)
GET    /api/orders                # All orders (admin)
PUT    /api/orders/:id/status     # Update status (admin)
```

### Users
```
GET    /api/users                 # All users (admin)
PUT    /api/users/:id/role        # Assign role (admin)
DELETE /api/users/:id             # Delete user (admin)
```

---

## 🌍 Deployment

### Frontend & Admin → Vercel

```bash
# Storefront
cd client && npm run build

# Admin panel
cd admin && npm run build
```

Connect both to Vercel as separate projects, or deploy the `/dist` folders manually.

### Backend → Render

1. Push repo to GitHub
2. Create a **Web Service** on [Render](https://render.com), root: `server/`
3. Add all environment variables from `.env` in Render's dashboard
4. Set start command: `node index.js`
5. Copy the Render URL → update `REACT_APP_API_URL` in your frontend `.env`

---

## 📄 License

MIT — free to use, modify, and distribute. See [`LICENSE`](LICENSE).

---

<div align="center">

Built by **Galata Desalegn** — Addis Ababa, Ethiopia

⭐ Star this repo if you found it useful!

</div>
