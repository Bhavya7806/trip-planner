// import React, { useState, useEffect, useContext } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import AuthContext from '../context/AuthContext';
// import './ItineraryPage.css';

// const ItineraryPage = () => {
//     const { tripId } = useParams();
//     const { token } = useContext(AuthContext);
//     const [trip, setTrip] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchTrip = async () => {
//             try {
//                 const config = { headers: { 'Authorization': `Bearer ${token}` } };
//                 const res = await axios.get(`/api/trips/${tripId}`, config);
//                 setTrip(res.data);
//             } catch (err) {
//                 setError('Failed to fetch itinerary.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         if (token) { fetchTrip(); }
//     }, [tripId, token]);

//     if (loading) return <div className="loading-text">Generating Your Adventure...</div>;
//     if (error) return <div className="error-message">{error}</div>;
//     if (!trip) return <div className="loading-text">Itinerary not found.</div>;

//     return (
//         <div className="page-container">
//             <div className="itinerary-page-container">
//                 <div className="itinerary-header-card">
//                     <span className="header-sub">TRIP TO</span>
//                     <h1>{trip.destination?.city}, {trip.destination?.country}</h1>
//                     <div className="header-details">
//                         <span>🗓️ {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
//                         <span>💰 Budget: ${trip.budget}</span>
//                         <span>✈️ From: {trip.startLocation?.city}</span>
//                     </div>
//                 </div>
                
//                 <div className="timeline-container">
//                     {trip.itineraryPlan.map((day, index) => (
//                         <div key={index} className="timeline-item">
//                             <div className="timeline-dot">
//                                 <div className="timeline-day-number">{day.day}</div>
//                             </div>
//                             <div className="timeline-content-card">
//                                 <h2>Day {day.day}</h2>
//                                 <div className="timeline-section">
//                                     <h4>Transport</h4>
//                                     <p>🚗 {day.transport}</p>
//                                 </div>
//                                 <div className="timeline-section">
//                                     <h4>Activities</h4>
//                                     <ul>
//                                         {day.activities.map((activity, i) => (
//                                             <li key={i}>- {activity}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                                 <div className="timeline-section">
//                                     <h4>Accommodation</h4>
//                                     <p>🏨 {day.accommodation}</p>
//                                 </div>
//                                 <div className="timeline-section">
//                                     <h4>Daily Budget</h4>
//                                     <p>💵 Approx. ${day.dailyBudget} for expenses.</p>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ItineraryPage;
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api'; // <-- Correct import
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
                const res = await api.get(`/api/trips/${tripId}`, config); // <-- Correct usage
                setTrip(res.data);
            } catch (err) {
                setError('Failed to fetch itinerary.');
            } finally {
                setLoading(false);
            }
        };
        if (token) { fetchTrip(); }
    }, [tripId, token]);

    if (loading) return <div className="loading-text">Generating Your Adventure...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!trip) return <div className="loading-text">Itinerary not found.</div>;

    return (
        <div className="page-container">
            <div className="itinerary-page-container">
                <div className="itinerary-header-card">
                    <span className="header-sub">TRIP TO</span>
                    <h1>{trip.destination?.city}, {trip.destination?.country}</h1>
                    <div className="header-details">
                        <span>🗓️ {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                        <span>💰 Budget: ${trip.budget}</span>
                        <span>✈️ From: {trip.startLocation?.city}</span>
                    </div>
                </div>
                
                <div className="timeline-container">
                    {/* Added optional chaining to prevent crash */}
                    {trip.itineraryPlan?.map((day, index) => (
                        <div key={index} className="timeline-item">
                            <div className="timeline-dot">
                                <div className="timeline-day-number">{day.day}</div>
                            </div>
                            <div className="timeline-content-card">
                                <h2>Day {day.day}</h2>
                                <div className="timeline-section">
                                    <h4>Transport</h4>
                                    <p>🚗 {day.transport}</p>
                                </div>
                                <div className="timeline-section">
                                    <h4>Activities</h4>
                                    <ul>
                                        {day.activities?.map((activity, i) => (
                                            <li key={i}>- {activity}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="timeline-section">
                                    <h4>Accommodation</h4>
                                    <p>🏨 {day.accommodation}</p>
                                </div>
                                <div className="timeline-section">
                                    <h4>Daily Budget</h4>
                                    <p>💵 Approx. ${day.dailyBudget} for expenses.</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ItineraryPage;
