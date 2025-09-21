// trip-planner-backend/routes/trips.js
const express = require('express');
const router = express.Router();

// Make sure both functions are imported from the controller
const { createTrip, getTripById } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

// Handles POST requests to /api/trips (creating a trip)
router.post('/', protect, createTrip);

// Handles GET requests to /api/trips/some_id (fetching a trip)
router.get('/:id', protect, getTripById);

module.exports = router;