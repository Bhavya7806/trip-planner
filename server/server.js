// server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// 1. Create the Express app
const app = express();

// 2. Use middleware AFTER the app is created
app.use(express.json());

// 3. Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// A simple test route (optional)
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));