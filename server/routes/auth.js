// routes/auth.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Defines the POST routes for registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// This line is the most important part!
// It exports the configured router so server.js can use it.
module.exports = router;