import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { name, email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/register', { name, email, password, });
            console.log('Signup successful, token:', res.data.token);
            navigate('/login');
        } catch (err) {
            setError(err.response.data.msg || 'Something went wrong');
        }
    };
    return (
        <div className="page-container"> 
        <div className="auth-container">
            <h2>Create Your Account</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={name} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={email} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={password} onChange={onChange} minLength="6" required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-btn">Sign Up</button>
            </form>
        </div>
        </div>
    );
};
export default SignupPage;