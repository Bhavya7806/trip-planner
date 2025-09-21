// controllers/tripController.js
const Trip = require('../models/Trip');


// @desc    Create a new trip
// @route   POST /api/trips
exports.createTrip = async (req, res) => {
    try {
        const { startLocation, destination, startDate, endDate, people, budget } = req.body;

        // --- Itinerary Generation Logic ---
        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        const diffTime = Math.abs(eDate - sDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        let sampleItinerary = [];
        for (let i = 1; i <= diffDays; i++) {
            let transportSuggestion = 'Use local transport (taxi, metro, bus) for sightseeing.';
            if (i === 1) {
                transportSuggestion = `Travel from ${startLocation.city} to ${destination.city} (e.g., flight, train, or car).`;
            }

            sampleItinerary.push({
                day: i,
                activities: [
                    `Morning activity for Day ${i}`,
                    `Afternoon visit to a local spot`,
                    `Dinner at a recommended restaurant`
                ],
                accommodation: `Details for hotel/stay on Day ${i}`,
                transport: transportSuggestion
            });
        }

        const newTrip = new Trip({
            user: req.user.id,
            startLocation,
            destination,
            startDate,
            endDate,
            people,
            budget,
            itineraryPlan: sampleItinerary
        });

        const savedTrip = await newTrip.save();
        res.status(201).json(savedTrip);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a single trip by ID
// @route   GET /api/trips/:id
exports.getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        res.json(trip);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Trip not found' });
        }
        res.status(500).send('Server Error');
    }
};