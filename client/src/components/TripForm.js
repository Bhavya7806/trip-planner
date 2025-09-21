// src/components/TripForm.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Country, State, City } from 'country-state-city';
import AuthContext from '../context/AuthContext';
import './TripForm.css';

const TripForm = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [startCountries, setStartCountries] = useState([]);
    const [startStates, setStartStates] = useState([]);
    const [startCities, setStartCities] = useState([]);
    const [selectedStartCountry, setSelectedStartCountry] = useState('');
    const [selectedStartState, setSelectedStartState] = useState('');
    const [selectedStartCity, setSelectedStartCity] = useState('');
    const [formData, setFormData] = useState({ startDate: '', endDate: '', adults: 1, children: 0, budget: '' });
    
    useEffect(() => { const allCountries = Country.getAllCountries(); setCountries(allCountries); setStartCountries(allCountries); }, []);
    useEffect(() => { if (selectedCountry) { setStates(State.getStatesOfCountry(selectedCountry)); setSelectedState(''); setCities([]); setSelectedCity(''); } }, [selectedCountry]);
    useEffect(() => { if (selectedCountry && selectedState) { setCities(City.getCitiesOfState(selectedCountry, selectedState)); setSelectedCity(''); } }, [selectedCountry, selectedState]);
    useEffect(() => { if (selectedStartCountry) { setStartStates(State.getStatesOfCountry(selectedStartCountry)); setSelectedStartState(''); setStartCities([]); setSelectedStartCity(''); } }, [selectedStartCountry]);
    useEffect(() => { if (selectedStartCountry && selectedStartState) { setStartCities(City.getCitiesOfState(selectedStartCountry, selectedStartState)); setSelectedStartCity(''); } }, [selectedStartCountry, selectedStartState]);
    
    const handleInputChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async e => {
        e.preventDefault();
        const tripData = {
            startLocation: { country: Country.getCountryByCode(selectedStartCountry)?.name, state: State.getStateByCodeAndCountry(selectedStartState, selectedStartCountry)?.name, city: selectedStartCity, },
            destination: { country: Country.getCountryByCode(selectedCountry)?.name, state: State.getStateByCodeAndCountry(selectedState, selectedCountry)?.name, city: selectedCity, },
            startDate: formData.startDate, endDate: formData.endDate, people: { adults: formData.adults, children: formData.children }, budget: formData.budget
        };
        try {
            const config = { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };
            const res = await axios.post('/api/trips', tripData, config);
            navigate(`/itinerary/${res.data._id}`);
        } catch (err) {
            console.error('Error creating trip:', err.response?.data);
            alert('Failed to save trip. Please try again.');
        }
    };
    return (
        <div className="trip-form-container">
            <h2>Plan Your Next Adventure</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Starting From (Your Home)</label>
                    <div className="destination-inputs">
                        <select value={selectedStartCountry} onChange={(e) => setSelectedStartCountry(e.target.value)} required> <option value="">Select Country</option> {startCountries.map(country => (<option key={country.isoCode} value={country.isoCode}>{country.name}</option>))} </select>
                        <select value={selectedStartState} onChange={(e) => setSelectedStartState(e.target.value)} disabled={!selectedStartCountry} required> <option value="">Select State</option> {startStates.map(state => (<option key={state.isoCode} value={state.isoCode}>{state.name}</option>))} </select>
                        <select value={selectedStartCity} onChange={(e) => setSelectedStartCity(e.target.value)} disabled={!selectedStartState} required> <option value="">Select City</option> {startCities.map(city => (<option key={city.name} value={city.name}>{city.name}</option>))} </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Destination</label>
                    <div className="destination-inputs">
                        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} required> <option value="">Select Country</option> {countries.map(country => (<option key={country.isoCode} value={country.isoCode}>{country.name}</option>))} </select>
                        <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} disabled={!selectedCountry} required> <option value="">Select State</option> {states.map(state => (<option key={state.isoCode} value={state.isoCode}>{state.name}</option>))} </select>
                        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState} required> <option value="">Select City</option> {cities.map(city => (<option key={city.name} value={city.name}>{city.name}</option>))} </select>
                    </div>
                </div>
                <div className="form-group form-row">
                    <div><label>Arrival Date</label><input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required /></div>
                    <div><label>Departure Date</label><input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required /></div>
                </div>
                <div className="form-group form-row">
                    <div><label>Adults</label><input type="number" name="adults" value={formData.adults} onChange={handleInputChange} min="1" required /></div>
                    <div><label>Children</label><input type="number" name="children" value={formData.children} onChange={handleInputChange} min="0" required /></div>
                </div>
                <div className="form-group">
                    <label>Your Budget ($)</label>
                    <input type="number" placeholder="e.g., 1500" name="budget" value={formData.budget} onChange={handleInputChange} required />
                </div>
                <button type="submit" className="submit-btn">Create Itinerary</button>
            </form>
        </div>
    );
};
export default TripForm;