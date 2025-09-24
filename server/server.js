// trip-planner-backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <-- 1. IMPORT
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');

dotenv.config();
connectDB();

const app = express();

// --- 2. USE CORS MIDDLEWARE ---
// This allows requests from your frontend
app.use(cors());

app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));