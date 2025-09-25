// // src/components/TripForm.js
// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Country, State, City } from 'country-state-city';
// import AuthContext from '../context/AuthContext';
// import Select from 'react-select'; // <-- NEW: Import custom select
// import DatePicker from 'react-datepicker'; // <-- NEW: Import date picker
// import "react-datepicker/dist/react-datepicker.css"; // <-- NEW: Import date picker styles
// import './TripForm.css';

// const TripForm = () => {
//     const { token } = useContext(AuthContext);
//     const navigate = useNavigate();

//     // State for dropdown options
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [startCountries, setStartCountries] = useState([]);
//     const [startStates, setStartStates] = useState([]);
//     const [startCities, setStartCities] = useState([]);

//     // State for selected values
//     const [selectedCountry, setSelectedCountry] = useState(null);
//     const [selectedState, setSelectedState] = useState(null);
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [selectedStartCountry, setSelectedStartCountry] = useState(null);
//     const [selectedStartState, setSelectedStartState] = useState(null);
//     const [selectedStartCity, setSelectedStartCity] = useState(null);

//     // State for other form data
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
//     const [formData, setFormData] = useState({ adults: 1, children: 0, budget: '' });

//     // Format data for react-select
//     const formatForSelect = (data) => data.map(item => ({ value: item.isoCode || item.name, label: item.name, ...item }));

//     // Effects for loading location data
//     useEffect(() => {
//         const allCountries = Country.getAllCountries();
//         setCountries(formatForSelect(allCountries));
//         setStartCountries(formatForSelect(allCountries));
//     }, []);
//     useEffect(() => { if (selectedCountry) { setStates(formatForSelect(State.getStatesOfCountry(selectedCountry.value))); setSelectedState(null); setCities([]); setSelectedCity(null); } }, [selectedCountry]);
//     useEffect(() => { if (selectedCountry && selectedState) { setCities(formatForSelect(City.getCitiesOfState(selectedCountry.value, selectedState.value))); setSelectedCity(null); } }, [selectedCountry, selectedState]);
//     useEffect(() => { if (selectedStartCountry) { setStartStates(formatForSelect(State.getStatesOfCountry(selectedStartCountry.value))); setSelectedStartState(null); setStartCities([]); setSelectedStartCity(null); } }, [selectedStartCountry]);
//     useEffect(() => { if (selectedStartCountry && selectedStartState) { setStartCities(formatForSelect(City.getCitiesOfState(selectedStartCountry.value, selectedStartState.value))); setSelectedStartCity(null); } }, [selectedStartCountry, selectedStartState]);

//     const handleInputChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleSubmit = async e => {
//         e.preventDefault();
//         const tripData = {
//             startLocation: { country: selectedStartCountry?.label, state: selectedStartState?.label, city: selectedStartCity?.label },
//             destination: { country: selectedCountry?.label, state: selectedState?.label, city: selectedCity?.label },
//             startDate, endDate, people: { adults: formData.adults, children: formData.children }, budget: formData.budget
//         };
//         try {
//             const config = { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };
//             const res = await axios.post('/api/trips', tripData, config);
//             navigate(`/itinerary/${res.data._id}`);
//         } catch (err) {
//             console.error('Error creating trip:', err.response?.data);
//             alert('Failed to save trip. Please try again.');
//         }
//     };

//     // Custom styles for react-select
//     const customSelectStyles = { control: (provided) => ({ ...provided, minHeight: '48px', borderRadius: '8px', border: '1px solid var(--light-gray)' }) };

//     return (
//         <div className="trip-form-container">
//             <h2>Plan Your Next Adventure</h2>
//             <form onSubmit={handleSubmit}>
//                 {/* Location Selects */}
//                 <div className="form-group">
//                     <label>Starting From (Your Home)</label>
//                     <div className="destination-inputs">
//                         <Select options={startCountries} value={selectedStartCountry} onChange={setSelectedStartCountry} placeholder="Select Country" styles={customSelectStyles} required />
//                         <Select options={startStates} value={selectedStartState} onChange={setSelectedStartState} placeholder="Select State" styles={customSelectStyles} isDisabled={!selectedStartCountry} required />
//                         <Select options={startCities} value={selectedStartCity} onChange={setSelectedStartCity} placeholder="Select City" styles={customSelectStyles} isDisabled={!selectedStartState} required />
//                     </div>
//                 </div>
//                 <div className="form-group">
//                     <label>Destination</label>
//                     <div className="destination-inputs">
//                         <Select options={countries} value={selectedCountry} onChange={setSelectedCountry} placeholder="Select Country" styles={customSelectStyles} required />
//                         <Select options={states} value={selectedState} onChange={setSelectedState} placeholder="Select State" styles={customSelectStyles} isDisabled={!selectedCountry} required />
//                         <Select options={cities} value={selectedCity} onChange={setSelectedCity} placeholder="Select City" styles={customSelectStyles} isDisabled={!selectedState} required />
//                     </div>
//                 </div>

//                 {/* Date Pickers */}
//                 <div className="form-group form-row">
//                     <div className="date-picker-wrapper">
//                         <label>Arrival Date</label>
//                         <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} className="date-input" placeholderText="Select date" required />
//                     </div>
//                     <div className="date-picker-wrapper">
//                         <label>Departure Date</label>
//                         <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} className="date-input" placeholderText="Select date" required />
//                     </div>
//                 </div>

//                 {/* Other Inputs */}
//                 <div className="form-group form-row">
//                     <div><label>Adults</label><input type="number" name="adults" value={formData.adults} onChange={handleInputChange} min="1" required /></div>
//                     <div><label>Children</label><input type="number" name="children" value={formData.children} onChange={handleInputChange} min="0" required /></div>
//                 </div>
//                 <div className="form-group">
//                     <label>Your Budget ($)</label>
//                     <input type="number" placeholder="e.g., 1500" name="budget" value={formData.budget} onChange={handleInputChange} required />
//                 </div>
//                 <button type="submit" className="submit-btn">Create Itinerary</button>
//             </form>
//         </div>
//     );
// };

// export default TripForm;
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // <-- 1. CHANGE THIS LINE
import { Country, State, City } from 'country-state-city';
import AuthContext from '../context/AuthContext';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './TripForm.css';

const TripForm = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    // All of your existing state and useEffect hooks remain the same...
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [startCountries, setStartCountries] = useState([]);
    const [startStates, setStartStates] = useState([]);
    const [startCities, setStartCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedStartCountry, setSelectedStartCountry] = useState(null);
    const [selectedStartState, setSelectedStartState] = useState(null);
    const [selectedStartCity, setSelectedStartCity] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [formData, setFormData] = useState({ adults: 1, children: 0, budget: '' });
    const formatForSelect = (data) => data.map(item => ({ value: item.isoCode || item.name, label: item.name, ...item }));
    useEffect(() => { const allCountries = Country.getAllCountries(); setCountries(formatForSelect(allCountries)); setStartCountries(formatForSelect(allCountries)); }, []);
    useEffect(() => { if (selectedCountry) { setStates(formatForSelect(State.getStatesOfCountry(selectedCountry.value))); setSelectedState(null); setCities([]); setSelectedCity(null); } }, [selectedCountry]);
    useEffect(() => { if (selectedCountry && selectedState) { setCities(formatForSelect(City.getCitiesOfState(selectedCountry.value, selectedState.value))); setSelectedCity(null); } }, [selectedCountry, selectedState]);
    useEffect(() => { if (selectedStartCountry) { setStartStates(formatForSelect(State.getStatesOfCountry(selectedStartCountry.value))); setSelectedStartState(null); setStartCities([]); setSelectedStartCity(null); } }, [selectedStartCountry]);
    useEffect(() => { if (selectedStartCountry && selectedStartState) { setStartCities(formatForSelect(City.getCitiesOfState(selectedStartCountry.value, selectedStartState.value))); setSelectedStartCity(null); } }, [selectedStartCountry, selectedStartState]);

    const handleInputChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        const tripData = {
            startLocation: { country: selectedStartCountry?.label, state: selectedStartState?.label, city: selectedStartCity?.label },
            destination: { country: selectedCountry?.label, state: selectedState?.label, city: selectedCity?.label },
            startDate, endDate, people: { adults: formData.adults, children: formData.children }, budget: formData.budget
        };
        try {
            const config = { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };
            const res = await api.post('/api/trips', tripData, config); // <-- 2. CHANGE THIS LINE
            navigate(`/itinerary/${res.data._id}`);
        } catch (err) {
            console.error('Error creating trip:', err.response?.data);
            alert('Failed to save trip. Please try again.');
        }
    };

    const customSelectStyles = { control: (provided) => ({ ...provided, minHeight: '48px', borderRadius: '8px', border: '1px solid var(--light-gray)' }) };

    return (
        <div className="trip-form-container">
            <h2>Plan Your Next Adventure</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Starting From (Your Home)</label>
                    <div className="destination-inputs">
                        <Select options={startCountries} value={selectedStartCountry} onChange={setSelectedStartCountry} placeholder="Select Country" styles={customSelectStyles} required />
                        <Select options={startStates} value={selectedStartState} onChange={setSelectedStartState} placeholder="Select State" styles={customSelectStyles} isDisabled={!selectedStartCountry} required />
                        <Select options={startCities} value={selectedStartCity} onChange={setSelectedStartCity} placeholder="Select City" styles={customSelectStyles} isDisabled={!selectedStartState} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>Destination</label>
                    <div className="destination-inputs">
                        <Select options={countries} value={selectedCountry} onChange={setSelectedCountry} placeholder="Select Country" styles={customSelectStyles} required />
                        <Select options={states} value={selectedState} onChange={setSelectedState} placeholder="Select State" styles={customSelectStyles} isDisabled={!selectedCountry} required />
                        <Select options={cities} value={selectedCity} onChange={setSelectedCity} placeholder="Select City" styles={customSelectStyles} isDisabled={!selectedState} required />
                    </div>
                </div>
                <div className="form-group form-row">
                    <div className="date-picker-wrapper">
                        <label>Arrival Date</label>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} className="date-input" placeholderText="Select date" required />
                    </div>
                    <div className="date-picker-wrapper">
                        <label>Departure Date</label>
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} className="date-input" placeholderText="Select date" required />
                    </div>
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
