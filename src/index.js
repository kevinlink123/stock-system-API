import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';

import categoriesRoutes from "./routes/categories.js";
import productsRoutes from "./routes/products.js";

if (!(process.env.NODE_ENV === "production")) {
  configDotenv();
  console.log("MODO DEV PA");
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://elyels.vidalatech.dpdns.org',
  'https://www.elyels.vidalatech.dpdns.org',
  'http://localhost:4321' // desarrollo local
]

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como móviles o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Origin bloqueado por CORS: ${origin}`);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// Middleware para manejar headers de proxy
app.use((req, res, next) => {
  // Confiar en headers de NPM
  if (req.headers['x-forwarded-proto'] === 'https') {
    req.secure = true;
  }
  next();
});

app.set('trust proxy', true);

app.use(express.json());

app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API Stock System Merceria Ely Els corriendo en puerto ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});