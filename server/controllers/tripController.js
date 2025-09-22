const Trip = require('../models/Trip');
const axios = require('axios');

// @desc    Create a new trip
// @route   POST /api/trips
exports.createTrip = async (req, res) => {
    try {
        const { startLocation, destination, startDate, endDate, people, budget } = req.body;

        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        const diffTime = Math.abs(eDate - sDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        // Calculate the daily budget
        const dailyBudget = Math.floor(budget / diffDays);

        // --- Fetch Real Attractions from Geoapify API ---
        let attractions = [];
        try {
            // First, get the place_id for the destination city
            const geocodeRes = await axios.get('https://api.geoapify.com/v1/geocode/search', {
                params: {
                    text: `${destination.city}, ${destination.country}`,
                    apiKey: process.env.GEOAPIFY_API_KEY
                }
            });

            const placeId = geocodeRes.data.features[0]?.properties.place_id;

            if (placeId) {
                // Now, find places of interest around that city's location
                const placesRes = await axios.get('https://api.geoapify.com/v2/places', {
                    params: {
                        categories: 'tourism.sights',
                        filter: `place:${placeId}`,
                        limit: 20,
                        apiKey: process.env.GEOAPIFY_API_KEY
                    }
                });

                if (placesRes.data.features) {
                    attractions = placesRes.data.features.map(place => place.properties.name);
                }
            }
        } catch (apiError) {
            console.error("Could not fetch attractions from Geoapify, using placeholders.", apiError.message);
            attractions = ["a famous local museum", "the central city square", "a beautiful park"];
        }

        // --- Build the Itinerary ---
        let sampleItinerary = [];
        for (let i = 1; i <= diffDays; i++) {
            let dailyActivities = [];
            if (attractions.length > 1) {
                dailyActivities.push(`Visit ${attractions.pop()}`);
                dailyActivities.push(`Explore ${attractions.pop()}`);
            } else {
                dailyActivities.push("Explore the city center");
            }
            dailyActivities.push("Dinner at a highly-rated local restaurant");

            let transportSuggestion = 'Use local transport for sightseeing.';
            if (i === 1) {
                transportSuggestion = `Travel from ${startLocation.city} to ${destination.city}.`;
            }

            sampleItinerary.push({
                day: i,
                activities: dailyActivities,
                accommodation: `Find a hotel near ${destination.city} center.`,
                transport: transportSuggestion,
                dailyBudget: dailyBudget
            });
        }

        // --- Save the Trip ---
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