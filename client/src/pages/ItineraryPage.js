// src/pages/ItineraryPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './ItineraryPage.css';

const ItineraryPage = () => {
    const { tripId } = useParams();
    const { token } = useContext(AuthContext);
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const res = await axios.get(`/api/trips/${tripId}`, config);
                setTrip(res.data);
            } catch (err) {
                setError('Failed to fetch itinerary.');
            } finally {
                setLoading(false);
            }
        };
        if (token) { fetchTrip(); }
    }, [tripId, token]);

    if (loading) return <div>Loading Itinerary...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!trip) return <div>Itinerary not found.</div>;

    return (
        <div className="page-container">
        <div className="itinerary-container">
            <h1>Your Itinerary for {trip.destination?.city}</h1>
            <div className="trip-summary">
                <p><strong>From:</strong> {trip.startLocation?.city}, {trip.startLocation?.country}</p>
                <p><strong>To:</strong> {trip.destination?.city}, {trip.destination?.country}</p>
                <p><strong>Dates:</strong> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                <p><strong>Budget:</strong> ${trip.budget}</p>
            </div>
            <div className="days-container">
                {trip.itineraryPlan.map(day => (
                    <div key={day.day} className="day-card">
                        <h2>Day {day.day}</h2>
                        <h4>Activities</h4>
                        <ul> {day.activities.map((activity, index) => ( <li key={index}>{activity}</li> ))} </ul>
                        <h4>Accommodation</h4>
                        <p>{day.accommodation}</p>
                        <h4>Transport</h4>
                        <p>{day.transport}</p>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};
export default ItineraryPage;