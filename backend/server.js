import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { seedAdmin } from './utils/adminSeeder.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Load env vars
dotenv.config();

// Connect to database and seed admin
const initializeApp = async () => {
    await connectDB();
    await seedAdmin();
};
initializeApp();

const app = express();
const httpServer = createServer(app);

// Configure trust proxy: allow override with TRUST_PROXY env var.
// If running behind a reverse proxy (Render, Heroku, etc.) set TRUST_PROXY=true
const trustProxyEnv = process.env.TRUST_PROXY;
if (typeof trustProxyEnv !== 'undefined') {
    const val = (trustProxyEnv === 'true' || trustProxyEnv === '1') ? 1 : 0;
    if (val) app.set('trust proxy', 1);
    console.log(`trust proxy set from TRUST_PROXY=${trustProxyEnv}: ${!!val}`);
} else if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    console.log('trust proxy set because NODE_ENV=production');
}

// ─── Allowed Origins (restrict in production) ───
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'https://astugebeya.vercel.app',
    'https://astugebeyaadminpanel.vercel.app',
].filter(Boolean);

// ─── Security Middleware ───

// MUST be before other middleware to handle preflight for all routes
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(ao => origin.startsWith(ao))) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    },
});

// Set security HTTP headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow Cloudinary images
}));

// Rate limiting on all API routes
app.use('/api', apiLimiter);

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom NoSQL Injection Protection for Express 5
const sanitizeObject = (obj) => {
    if (obj instanceof Object) {
        for (const key in obj) {
            if (key.startsWith('$')) {
                delete obj[key];
            } else {
                sanitizeObject(obj[key]);
            }
        }
    }
    return obj;
};

app.use((req, res, next) => {
    sanitizeObject(req.body);
    sanitizeObject(req.query);
    sanitizeObject(req.params);
    next();
});

// HTTP Parameter Pollution protection
app.use(hpp());

// Logging (dev only)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Trust proxy (for rate limiting behind reverse proxy)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// ─── Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Handle 404 - Route not found
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ─── Socket.io Logic ───
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', (room) => {
        if (typeof room !== 'string' || room.length > 100) return;
        socket.join(room);
    });

    socket.on('send_message', (data) => {
        if (!data || !data.room) return;
        io.to(data.room).emit('receive_message', data);
    });

    socket.on('edit_message', (data) => {
        if (!data || !data.room) return;
        io.to(data.room).emit('message_edited', data);
    });

    socket.on('delete_message', (data) => {
        if (!data || !data.room) return;
        io.to(data.room).emit('message_deleted', data);
    });

    socket.on('disconnect', () => {
        // silent disconnect
    });
});

// ─── Centralized Error Handler (MUST be last middleware) ───
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
